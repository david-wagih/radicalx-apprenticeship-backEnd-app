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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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

  @Post('create_apprenticeship/:userID')
  @Header('content-type', 'application/json')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'companyLogo' }, { name: 'companyVideo' }]),
  )
  async createApprenticeship(
    @Request() request: Request,
    @Param() query: string[],
    @Body() apprenticeship_details: JSON,
    @UploadedFiles()
    files: {
      companyLogo?: Express.Multer.File[];
      companyVideo?: Express.Multer.File[];
    },
  ) {
    const authorizationHeader: string = request.headers['authorization'];
    const creator = query['userID'];
    const apprenticeshipTitle = apprenticeship_details['apprenticeshipTitle'];
    const companyDescription = apprenticeship_details['companyDescription'];
    const apprenticeshipDescription =
      apprenticeship_details['apprenticeshipDescription'];
    const teamType = apprenticeship_details['teamType'];
    const teamRoles = apprenticeship_details['teamRoles'];
    const teamAdmins = apprenticeship_details['teamAdmins'];
    const timeline = apprenticeship_details['timeline'];
    return await this.dbService.createApprenticeship(
      authorizationHeader,
      creator,
      files['companyLogo'],
      companyDescription,
      files['companyVideo'],
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'companyLogo'},
      { name: 'companyVideo'},
    ]),
  )
  async updateApprenticeship(
    @Request() request: Request,
    @Param() query: string[],
    @Body() apprenticeship_details: JSON,
    @UploadedFiles()
    files: {
      companyLogo?: Express.Multer.File[];
      companyVideo?: Express.Multer.File[];
    },
  ) {
    const authorizationHeader: string = request.headers['authorization'];
    const apprenticeshipID = query['apprenticeshipID'];
    const creator = query['userID'];
    const apprenticeshipTitle = apprenticeship_details['apprenticeshipTitle'];
    const companyDescription = apprenticeship_details['companyDescription'];
    const apprenticeshipDescription =
      apprenticeship_details['apprenticeshipDescription'];
    const teamType = apprenticeship_details['teamType'];
    const teamRoles = apprenticeship_details['teamRoles'];
    const teamAdmins = apprenticeship_details['teamAdmins'];
    const timeline = apprenticeship_details['timeline'];
    return await this.dbService.updateApprenticeship(
      authorizationHeader,
      creator,
      apprenticeshipID,
      files['companyLogo'],
      companyDescription,
      files['companyVideo'],
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
