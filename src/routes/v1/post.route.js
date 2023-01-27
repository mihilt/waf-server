const express = require('express');

const controller = require('../../controllers/post');

const router = express.Router();

/**
 * @api {post} v1/post 게시글 작성
 * @apiDescription 게시글 작성
 * @apiVersion 1.0.0
 * @apiName postPost
 * @apiGroup Post
 *
 * @apiParam  {String}  author          작성자
 * @apiParam  {String}  password        비밀번호
 * @apiParam  {String}  title           제목
 * @apiParam  {String}  contents        내용
 *
 * @apiSuccess {String}  postId         게시글 번호
 * @apiSuccess {String}  ip             작성자 IP
 * @apiSuccess {String}  author         작성자
 * @apiSuccess {String}  title          제목
 * @apiSuccess {String}  contents       내용
 * @apiSuccess {Boolean}  deleted       삭제 여부
 * @apiSuccess {Date}  createdAt        생성일
 * @apiSuccess {Date}  updatedAt        수정일
 *
 * @apiError (Bad Request 400)  Required fields are missing
 */
router.post('/', controller.postPost);

/**
 * @api {get} v1/post/:postId 게시글 조회
 * @apiDescription 게시글 조회
 * @apiVersion 1.0.0
 * @apiName getPost
 * @apiGroup Post
 *
 * @apiParam  {String}  postId          게시글 번호
 *
 * @apiSuccess {String}  postId         게시글 번호
 * @apiSuccess {String}  ip             작성자 IP
 * @apiSuccess {String}  author         작성자
 * @apiSuccess {String}  title          제목
 * @apiSuccess {String}  contents       내용
 * @apiSuccess {Boolean}  deleted       삭제 여부
 * @apiSuccess {Date}  createdAt        생성일
 * @apiSuccess {Date}  updatedAt        수정일
 *
 * @apiError (Not Found 404)  Post not found
 */
router.get('/:postId', controller.getPost);

module.exports = router;
