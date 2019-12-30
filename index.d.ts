/// <reference types="node" />
import { Context } from 'vm';
export default function commandLineArgs(): {
    source: string;
    destiny: string;
    sandbox: Context;
};
