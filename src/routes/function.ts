'use strict';

import * as Router from 'koa-router';
import * as moment from 'moment';
import * as settingConfig from 'config';
// import * as emoji from 'telegram-emoji-map';

import logger from '../util/logger';
import {upsertData} from '../module/insertDB';
import {getPaging} from '../util/paging';

import { config } from 'winston'

// dao
import singnalDAO from '../dao/signalDAO';
import userDAO from '../dao/complainUserDAO';
import albaDAO from '../dao/albaReviewDAO';

// condition
import {ipAllowedCheck} from '../module/condition';

const router: Router = new Router();

router.use( async function (ctx, next) {
  const ipFlag = await ipAllowedCheck(ctx);
  if(ipFlag) {
    return next();
  }
  else {
    logger.info(`not allowed user access ip: ${ctx.ip}`);
    return ctx.render('error', {message: "Not Allowed User"});
  }
})

router.get('/sendmsg', async (ctx, next) => {
  const forum = 'test'
  return ctx.render('sendmsg', {forum});
})
 // 특정 고객 포인트 변경(불편사항 퀄리티에 따라 변경)
 router.post('/albaregister', async (ctx, next) => { 
  const email = ctx.request.body.emailValue; // 이메일 
  const company_name = ctx.request.body.company_name; // 회사이름
  const review = ctx.request.body.review; // 후기
  const alDAO = new albaDAO();
  await alDAO.updateAlbaCompany(email, company_name);
  await alDAO.updateAlbaReview(email, review);

  return ctx.render('index');  
});

export default router;