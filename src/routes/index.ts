'use strict';

import * as Router from 'koa-router';
import * as moment from 'moment';
import * as settingConfig from 'config';
// import * as emoji from 'telegram-emoji-map';

import logger from '../util/logger';
import overviewRouter from './overview';
import functionRouter from './function';
import {upsertData} from '../module/insertDB';
import {getPaging} from '../util/paging';

import { config } from 'winston';

// dao
import signalDAO from '../dao/signalDAO';
import complainUserDAO from '../dao/complainUserDAO';
import flagDAO from '../dao/flagDAO';
import nameDAO from '../dao/nameDAO';
import { start } from 'repl';
import albaDAO from '../dao/albaReviewDAO';

const db_modules = [upsertData]
const router: Router = new Router();

let complainPoint = 500;

// Dashboard
router.get('/', async (ctx, next) => {
  logger.info('index here');

  return ctx.render('index');
})

router.get('/ping', async (ctx, next) => {
  return ctx.body = "OK";
})

router.post('/albaregister', async (ctx, next) => { 
  console.log('alba here'); 
  const email = ctx.request.body.emailValue; // 이메일 
  const company_name = ctx.request.body.company_name; // 회사이름
  const review = ctx.request.body.review; // 후기

  const alDAO = new albaDAO();
  await alDAO.updateAlbaCompany(email, company_name);
  await alDAO.updateAlbaReview(email, review);

  return ctx.redirect('/');
});

router.use('/function', functionRouter.routes());
export default router;