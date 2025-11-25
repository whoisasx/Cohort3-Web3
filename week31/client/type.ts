import * as borsh from "borsh";
export class CounterAccount {
	count = 0;
	constructor({ count }: { count: number }) {
		this.count = count;
	}
}
export const schema: borsh.Schema = { struct: { count: "u32" } };

export const GREETING_SIZE = borsh.serialize(
	schema,
	new CounterAccount({ count: 0 })
).length;

export class IncrementInstruction {
	instruction: number;
	amount: number;
	constructor(fields: { instruction: number; amount: number }) {
		this.instruction = fields.instruction;
		this.amount = fields.amount;
	}
}
export class DecrementInstruction {
	instruction: number;
	amount: number;
	constructor(fields: { instruction: number; amount: number }) {
		this.instruction = fields.instruction;
		this.amount = fields.amount;
	}
}

export const incrementInstructionSchema: borsh.Schema = {
	struct: {
		instruction: "u8",
		amount: "u32",
	},
};
export const decrementInstructionSchema: borsh.Schema = {
	struct: {
		instruction: "u8",
		amount: "u32",
	},
};

export const instructionSchema: borsh.Schema = {
	enum: [
		{
			struct: {
				instruction: "u8",
				amount: "u32",
			},
		},
		{
			struct: {
				instruction: "u8",
				amount: "u32",
			},
		},
	],
};
