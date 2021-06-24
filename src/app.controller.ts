import {
  CacheInterceptor,
  Controller,
  Post,
  Get,
  Req,
  Res,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

import urlMetadata = require('url-metadata');
import { Response, Request } from 'express';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Req() req: Request, @Res() res: Response) {
    const { url } = req.body;
    urlMetadata(url).then(
      function (metadata) {
        // success handler
        res.status(HttpStatus.CREATED).json({
          Title: metadata.title,
          Description: metadata.description,
          Image: metadata.image,
        });
      },
      function (error) {
        // failure handler
        console.log(error);
      },
    );
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  get(@Req() req: Request, @Res() res: Response) {
    axios
      .get(req.body.url)
      .then((response) => {
        res.status(200).json({
          data: response.data,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  }
}
