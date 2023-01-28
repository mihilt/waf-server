const express = require('express');

const controller = require('../../controllers/comment');

const router = express.Router();

/**
 * @api {post} v1/comment/ 댓글 작성
 * @apiDescription 댓글 작성
 * @apiVersion 1.0.0
 * @apiName postComment
 * @apiGroup Comment
 * @apiPermission everyone
 *
 * @apiParam  {String}  postId          게시글 번호
 * @apiParam  {String}  author          작성자
 * @apiParam  {String}  password        비밀번호
 * @apiParam  {String}  contents        내용
 * @apiParam  {String}  parentComment   부모 댓글 번호
 *
 * @apiSuccess {String}  commentId      댓글 번호
 * @apiSuccess {String}  postId         게시글 번호
 * @apiSuccess {String}  ip             작성자 IP
 * @apiSuccess {String}  author         작성자
 * @apiSuccess {String}  contents       내용
 * @apiSuccess {String}  parentComment  부모 댓글 번호
 * @apiSuccess {Date}  createdAt        생성일
 * @apiSuccess {Date}  updatedAt        수정일
 *
 * @apiError (Bad Request 400)  Required fields are missing
 */
router.post('/', controller.postComment);

/**
 * @api {delete} v1/comment/:commentId 댓글 삭제
 * @apiDescription 댓글 삭제
 * @apiVersion 1.0.0
 * @apiName deleteComment
 * @apiGroup Comment
 * @apiPermission everyone
 *
 * @apiParam  {String}  commentId 댓글 번호
 * @apiParam  {String}  postId    게시글 번호
 * @apiParam  {String}  password   비밀번호
 *
 * @apiErorr (Bad Request 400)  Comment not found
 */
router.delete('/', controller.deleteComment);

module.exports = router;
