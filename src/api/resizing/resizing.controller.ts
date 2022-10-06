import { Controller } from "@nestjs/common";
import { ResizingService } from "./resizing.service";


@Controller()
export class ResizingController {
    constructor(private readonly resizingService: ResizingService) {}
}