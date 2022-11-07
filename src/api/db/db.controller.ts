import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Header,
  Delete,
  Request,
} from '@nestjs/common';
import { DbService } from './db.service';
import * as admin from 'firebase-admin';

@Controller()
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Get('data/:userID')
  @Header('content-type', 'application/json')
  async GetUserApprenticeships(
    @Request() request: Request,
    @Param() query: string[],
  ) {
    const authorization: Map<string, string> =
      request.headers['authorization'].split(' ');
    const userID = query['userID'];
    return await this.dbService.getUserApprenticeships(authorization, userID);
  }

  @Post('create_apprenticeship/:userID')
  @Header('content-type', 'application/json')
  async createApprenticeship(
    @Request() request: Request,
    @Param() query: string[],
    @Body() apprenticeship_details: JSON,
  ) {
    const authorization: Map<string, string> =
      request.headers['authorization'].split(' ');
    const creator = query['userID'];
    const apprenticeshipTitle = apprenticeship_details['apprenticeshipTitle'];
    const companyLogo = apprenticeship_details['companyLogo'];
    const companyDescription = apprenticeship_details['companyDescription'];
    const apprenticeshipDescription =
      apprenticeship_details['apprenticeshipDescription'];
    const companyVideo = apprenticeship_details['companyVideo'];
    const teamType = apprenticeship_details['teamType'];
    const teamRoles = apprenticeship_details['teamRoles'];
    const teamAdmins = apprenticeship_details['teamAdmins'];
    const timeline = apprenticeship_details['timeline'];
    return await this.dbService.createApprenticeship(
      authorization,
      creator,
      companyLogo,
      companyDescription,
      companyVideo,
      apprenticeshipTitle,
      apprenticeshipDescription,
      teamType,
      teamRoles,
      teamAdmins,
      timeline,
    );
  }

  @Delete('delete/:apprenticeshipID')
  @Header('content-type', 'application/json')
  async delete(@Request() request: Request, @Param() query: string[]) {
    const authorization: Map<string, string> =
      request.headers['authorization'].split(' ');
    const apprenticeshipID = query['apprenticeshipID'];
    return await this.dbService.deleteApprenticeship(
      authorization,
      apprenticeshipID,
    );
  }
}
