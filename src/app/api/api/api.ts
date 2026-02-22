export * from './commentController.service';
import { CommentControllerService } from './commentController.service';
export * from './postController.service';
import { PostControllerService } from './postController.service';
export * from './subScapeController.service';
import { SubScapeControllerService } from './subScapeController.service';
export * from './userController.service';
import { UserControllerService } from './userController.service';
export const APIS = [CommentControllerService, PostControllerService, SubScapeControllerService, UserControllerService];
