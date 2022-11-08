import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Header,
  Delete,
  Request,
  Put,
} from '@nestjs/common';
import { DbService } from './db.service';

@Controller()
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Get('data/:userID')
  @Header('content-type', 'application/json')
  async GetUserApprenticeships(
    @Request() request: Request,
    @Param() query: string[],
  ) {
    const authorizationHeader: string = request.headers['authorization'];
    const userID = query['userID'];
    return await this.dbService.getUserApprenticeships(
      authorizationHeader,
      userID,
    );
  }
  @Get('data/:userID/:apprenticeshipID')
  @Header('content-type', 'application/json')
  async GetApprenticeship(
    @Request() request: Request,
    @Param() query: string[],
  ) {
    const authorizationHeader: string = request.headers['authorization'];
    const userID = query['userID'];
    const apprenticeshipID = query['apprenticeshipID'];
    return await this.dbService.getApprenticeship(
      authorizationHeader,
      userID,
      apprenticeshipID,
    );
  }

  @Post('create_apprenticeship/:userID')
  @Header('content-type', 'application/json')
  async createApprenticeship(
    @Request() request: Request,
    @Param() query: string[],
    @Body() apprenticeship_details: JSON,
  ) {
    const authorizationHeader: string = request.headers['authorization'];
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
      authorizationHeader,
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

  @Put('update_apprenticeship/:apprenticeshipID')
  @Header('content-type', 'application/json')
  async updateApprenticeship(
    @Request() request: Request,
    @Param() query: string[],
    @Body() apprenticeship_details: JSON,
  ) {
    const authorizationHeader: string = request.headers['authorization'];
    const apprenticeshipID = query['apprenticeshipID'];
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
    return await this.dbService.updateApprenticeship(
      authorizationHeader,
      creator,
      apprenticeshipID,
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

  @Post('duplicate_apprenticeship/:apprenticeshipID')
  @Header('content-type', 'application/json')
  async duplicateApprenticeship(
    @Request() request: Request,
    @Param() query: string[],
  ) {
    const authorizationHeader: string = request.headers['authorization'];
    const apprenticeshipID = query['apprenticeshipID'];
    return await this.dbService.duplicateApprenticeship(
      authorizationHeader,
      apprenticeshipID,
    );
  }

  @Delete('delete_apprenticeship/:apprenticeshipID')
  @Header('content-type', 'application/json')
  async delete(@Request() request: Request, @Param() query: string[]) {
    const authorizationHeader: string = request.headers['authorization'];
    const apprenticeshipID = query['apprenticeshipID'];
    return await this.dbService.deleteApprenticeship(
      authorizationHeader,
      apprenticeshipID,
    );
  }
}
