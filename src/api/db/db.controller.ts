import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Header,
  Delete,
} from '@nestjs/common';
import { DbService } from './db.service';
@Controller({ host: 'localhost', path: 'db' })
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Get('data/:userID')
  @Header('content-type', 'application/json')
  GetUserApprenticeships(@Param() query: string[]) {
    const userID = query['userID'];
    return this.dbService.getUserApprenticeships(userID);
  }

  @Post('create_apprenticeship/:userID')
  @Header('content-type', 'application/json')
  createApprenticeship(
    @Param() query: string[],
    @Body() apprenticeship_details: JSON,
  ) {
    const creator = query['id'];
    const apprenticeshipTitle = apprenticeship_details['apprenticeshipTitle'];
    const companyLogo = apprenticeship_details['companyLogo'];
    const companyDescription = apprenticeship_details['companyDescription'];
    const apprenticeshipDescription =
      apprenticeship_details['apprenticeshipDescription'];
    const companyVideo = apprenticeship_details['companyVideo'];
    const companyTitle = apprenticeshipDescription['companyTitle'];
    const teamType = apprenticeship_details['teamType'];
    const teamRoles = apprenticeship_details['teamRoles'];
    const teamAdmins = apprenticeship_details['teamAdmins'];
    const timeline = apprenticeship_details['timeline'];
    return this.dbService.createApprenticeship(
      creator,
      companyTitle,
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

  @Delete('delete/:id')
  @Header('content-type', 'application/json')
  delete(@Param() query: string[]) {
    const id = query['id'];
    return this.dbService.deleteApprenticeship(id);
  }
}
