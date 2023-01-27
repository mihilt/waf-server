const express = require('express');

const controller = require('../../controllers/post');

const router = express.Router();

/**
 * @api {post} v1/post 게시글 작성
 * @apiDescription 게시글 작성
 * @apiVersion 1.0.0
 * @apiName postPost
 * @apiGroup Post
 * @apiPermission everyone
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

router
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
  .get('/:postId', controller.getPost)
  /**
   * @api {patch} v1/post/:postId 게시글 수정
   * @apiDescription 게시글 수정
   * @apiVersion 1.0.0
   * @apiName patchPost
   * @apiGroup Post
   * @apiPermission everyone
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
   * @apiError (Not Found 404)  Post not found
   *
   */
  .patch('/:postId', controller.patchPost)
  /**
   * @api {delete} v1/post/:postId 게시글 삭제
   * @apiDescription 게시글 삭제
   * @apiVersion 1.0.0
   * @apiName deletePost
   * @apiGroup Post
   * @apiPermission everyone
   *
   * @apiParam  {String}  password        비밀번호
   *
   *
   * @apiError (Not Found 404)  Post not found
   * @apiError (Bad Request 400)  Required fields are missing
   */
  .delete('/:postId', controller.deletePost);

// TODO: check post's password
// TODO: get posts

module.exports = router;
