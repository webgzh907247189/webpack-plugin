import { Compiler } from 'webpack';
export default class DeleteSourcemap {
    apply(compile: Compiler): void;
}
