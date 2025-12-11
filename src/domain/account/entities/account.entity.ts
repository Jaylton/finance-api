export class Account {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly init_amount: number,
        readonly current_amount: number,
    ) { }
}
