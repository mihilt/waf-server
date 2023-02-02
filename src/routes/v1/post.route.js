const express = require('express');

const controller = require('../../controllers/post');

const router = express.Router();

/**
 * @api {get} v1/post 게시글 목록 조회
 * @apiDescription 게시글 목록 조회
 * @apiVersion 1.0.0
 * @apiName getPost
 * @apiGroup Post
 * @apiPermission everyone
 *
 * @apiParam  {String}  categoryId             카테고리 아이디
 * @apiParam  {Number}  page                 페이지 번호
 * @apiParam  {Number}  limit                페이지당 게시글 수
 *
 * @apiSuccess {Number}  count               전체 게시글 수
 * @apiSuccess {Object[]}  result            게시글 목록
 * @apiSuccess {String}  result.postId       게시글 번호
 * @apiSuccess {String}  result.categorySeq   카테고리 시퀀스
 * @apiSuccess {String}  result.categoryId     카테고리 아이디
 * @apiSuccess {String}  result.ip           작성자 IP
 * @apiSuccess {String}  result.author       작성자
 * @apiSuccess {String}  result.title        제목
 * @apiSuccess {Date}  result.createdAt      생성일
 * @apiSuccess {Date}  result.updatedAt      수정일
 * @apiSuccess {Number}  result.commentCount     댓글 수
 *
 * @apiError (Bad Request 400)  Invalid page or limit
 */
router.get('/', controller.getPosts);

/**
 * @api {post} v1/post 게시글 작성
 * @apiDescription 게시글 작성
 * @apiVersion 1.0.0
 * @apiName postPost
 * @apiGroup Post
 * @apiPermission everyone
 *
 * @apiParam  {String}  categoryId                 카테고리 아이디
 * @apiParam  {String}  author                   작성자
 * @apiParam  {String}  password                 비밀번호
 * @apiParam  {String}  title                    제목
 * @apiParam  {String}  content                 내용
 *
 * @apiSuccess {String}  postId                  게시글 번호
 * @apiSuccess {String}  categorySeq              카테고리 시퀀스
 * @apiSuccess {String}  categoryId                카테고리 아이디
 * @apiSuccess {String}  author                  작성자
 * @apiSuccess {String}  title                   제목
 * @apiSuccess {String}  content                내용
 * @apiSuccess {Boolean}  deleted                삭제 여부
 * @apiSuccess {Date}  createdAt                 생성일
 * @apiSuccess {Date}  updatedAt                 수정일
 * @apiSuccess {String}  ip                      작성자 IP
 * @apiSuccess {Object[]}  comments              댓글 목록
 * @apiSuccess {String}  comments.commentId      댓글 번호
 * @apiSuccess {String}  comments.ip             작성자 IP
 * @apiSuccess {String}  comments.author         작성자
 * @apiSuccess {String}  comments.content       내용
 * @apiSuccess {Boolean}  comments.deleted       삭제 여부
 * @apiSuccess {Date}  comments.createdAt        생성일
 * @apiSuccess {Date}  comments.updatedAt        수정일
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
   * @apiSuccess {String}  categoryId       카테고리 아이디
   * @apiSuccess {String}  ip             작성자 IP
   * @apiSuccess {String}  author         작성자
   * @apiSuccess {String}  title          제목
   * @apiSuccess {String}  content       내용
   * @apiSuccess {Boolean}  deleted       삭제 여부
   * @apiSuccess {Date}  createdAt        생성일
   * @apiSuccess {Date}  updatedAt        수정일
   *
   * @apiError (Not Found 400)  Post not found
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
   * @apiParam  {String}  content        내용
   *
   * @apiSuccess {String}  postId         게시글 번호
   * @apiSuccess {String}  ip             작성자 IP
   * @apiSuccess {String}  author         작성자
   * @apiSuccess {String}  title          제목
   * @apiSuccess {Boolean}  deleted       삭제 여부
   * @apiSuccess {Date}  createdAt        생성일
   * @apiSuccess {Date}  updatedAt        수정일
   *
   * @apiError (Bad Request 400)  Required fields are missing
   * @apiError (Not Found 400)  Post not found
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
   * @apiError (Not Found 400)  Post not found
   * @apiError (Bad Request 400)  Required fields are missing
   */
  .delete('/', controller.deletePost);

router.get('/:categoryId/:categorySeq', controller.getPost);

/**
 * @api {post} v1/post/check-password/:postId 비밀번호 확인
 * @apiDescription 비밀번호 확인
 * @apiVersion 1.0.0
 * @apiName checkPasswordPost
 * @apiGroup Post
 * @apiPermission everyone
 *
 * @apiParam  {String}  postId          게시글 번호
 * @apiParam  {String}  password        비밀번호
 *
 * @apiSuccess {String}  postId         게시글 번호
 * @apiSuccess {String}  categorySeq     카테고리 시퀀스
 * @apiSuccess {String}  categoryId       카테고리 아이디
 * @apiSuccess {String}  author         작성자
 * @apiSuccess {String}  password       비밀번호 (수정 요청시 필요)
 * @apiSuccess {String}  title          제목
 * @apiSuccess {String}  content       내용
 * @apiSuccess {Boolean}  deleted       삭제 여부
 * @apiSuccess {Date}  createdAt        생성일
 * @apiSuccess {Date}  updatedAt        수정일
 * @apiSuccess {String}  ip             작성자 IP
 *
 * @apiError (Bad Request 400)  Required fields are missing
 * @apiError (Not Found 400)  Post not found
 */
router.post('/check-password', controller.checkPasswordPost);

router.post('/like', controller.likePost);

router.post('/dislike', controller.dislikePost);

module.exports = router;
