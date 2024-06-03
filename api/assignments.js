const { Router } = require('express')
const { ValidationError } = require('sequelize')
const { Assignment, AssignmentClientFields } = require('../models/assignment')
const { Submission, SubmissionClientFields } = require('../models/submission')
const { upload } = require('../lib/multer')

const router = Router()

/*
 * Route to create a new assignment
    TODO: Limit creation to an authenticated User with 'admin' role or an authenticated 'instructor' User 
    whose ID matches the instructorId of the Course corresponding to the Assignment's courseId can create an Assignment.
 */
router.post('/', async (req, res, next) => {
    try {
        console.log(req.body)
        const assignment = await Assignment.create(req.body, AssignmentClientFields)
        res.status(201).send(assignment)
    } catch (e) {
        if (e instanceof ValidationError) {
          res.status(400).send({ error: e.message })
        } else {
          next(e)
        }
    }
})

/*
 * Route to fetch info about a specific assignment
 */
router.get('/:assignmentId', async function (req, res, next) {
    const assignmentId = req.params.assignmentId
    try {
        const assignment = await Assignment.findByPk(assignmentId)
        if (assignment) {
            res.status(200).send(assignment)
        } else {
            next()
        }
    } catch (e) {
        next(e)
    }
})

/*
 * Route to update data for a assignment
    TODO: Limit patching to an authenticated User with 'admin' role or an authenticated 'instructor' User 
    whose ID matches the instructorId of the Course corresponding to the Assignment's courseId
 */
router.patch('/:assignmentId', async function (req, res, next) {
    const assignmentId = req.params.assignmentId
    try {
        const assignment = await Assignment.update(req.body, {
            where: {
                id: assignmentId
            },
            fields: AssignmentClientFields
        })

        if (assignment[0] > 0) {
            res.status(204).send()
        } else {
            next()
        }
    } catch (e) {
        next(e)
    }
})

/*
 * Route to delete a assignment
    TODO: Limit deleting to an authenticated User with 'admin' role or an authenticated 'instructor' User 
    whose ID matches the instructorId of the Course corresponding to the Assignment's courseId
 */
router.delete('/:assignmentId', async function (req, res, next) {
    const assignmentId = req.params.assignmentId
    try {
        const result = await Assignment.destroy({
            where: {
                id: assignmentId
            }
        })

        if (result) {
            res.status(204).send()
        } else {
            next()
        }
    } catch (e) {
        next(e)
    }
})

/*
 * Route to fetch all submissions for a given assignment
    TODO: Limit fetching to an authenticated User with 'admin' role or an authenticated 'instructor User 
    whose ID matches the instructorId of the Course corresponding to the Assignment's courseId
 */
router.get('/:assignmentId/submissions', async function (req, res, next) {
    /*
    * Compute page number based on optional query string parameter `page`.
    * Make sure page is within allowed bounds.
    */
    let page = parseInt(req.query.page) || 1;
    page = page < 1 ? 1 : page;
    const numPerPage = 10;
    const offset = (page - 1) * numPerPage;

    const assignmentId = req.params.assignmentId
    const userId = req.query.userId;

    // Filters by userId if it exists, otherwise just filters by assignmentId
    const whereClause = userId ? { assignmentId, userId } : { assignmentId };

    try {
        const submissions = await Submission.findAndCountAll({
            where: whereClause,
            limit: numPerPage,
            offset: offset
        })

        if (submissions.count === 0) {
            res.status(404).send({
                error: "No submissions found using provided id"
            })
        }

        /*
        * Generate HATEOAS links for surrounding pages.
        */
        const lastPage = Math.ceil(submissions.count / numPerPage);
        const links = {};
        if (page < lastPage) {
            links.nextPage = `/assignments/${assignmentId}/submissions?page=${page + 1}`;
            links.lastPage = `/assignments/${assignmentId}/submissions?page=${lastPage}`;
        }
        if (page > 1) {
            links.prevPage = `/assignments/${assignmentId}/submissions?page=${page - 1}`;
            links.firstPage = `/assignments/${assignmentId}/submissions?page=1`;
        }

        /*
        * Construct and send response.
        */
        res.status(200).send({
            submissions: submissions.rows,
            pageNumber: page,
            totalPages: lastPage,
            pageSize: numPerPage,
            totalCount: submissions.count,
            links: links,
        });

    
    } catch (e) {
        next(e)
    }
})

/*
 * Route to create a new submission for an assignment
    TODO: Limit creating to an authenticated User with 'admin' role or an authenticated 'instructor User 
    whose ID matches the instructorId of the Course corresponding to the Assignment's courseId
 */
router.post(
    '/:assignmentId/submissions', 
    upload.single('file'),
    async function (req, res, next) {
        //console.log("== req.file:", req.file)
        //console.log("== req.body:", req.body)
    if (req.file) {
        const filepath = `/media/submissions/${req.file.filename}` 
        try {
            // Destructuring to exclude grade field in creation
            const { grade, ...otherFields } = req.body;
            const submission = await Submission.create({...otherFields, file: filepath}, SubmissionClientFields)
       
            res.status(201).send({
                id: submission.id,
            })
        } catch (e) {
            if (e instanceof ValidationError) {
                res.status(400).send({ error: e.message })
            } else {
                next(e)
            }
        }
    } else {
        res.status(400).send({
            error: "Invalid file type"
        })
    }
})


module.exports = router