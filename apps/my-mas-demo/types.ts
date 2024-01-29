import { JSON } from '@klave/sdk';

@serializable
export class ErrorMessage {
    success!: boolean;
    message!: string;
}

@serializable
export class algorithmData {
    name!: string;
    age!: u8;
    isMale!: boolean;
    monthlyIncome!: u32;
    monthlyExpense!: u32;
    monthlySaving!: u32;
    profession!: string;
}

@serializable
export class algorithmInput {
    input!: algorithmData[];
}

@serializable
export class algorithmOutput {
    averageMonthly!: u32[];
    averageMaleMonthly!: u32[];
    averageFemaleMonthly!: u32[];
    averageMonthlyPerAgeGroup!: u32[][];
    totalMonthly!: u32[];
}

@serializable
export class monthlyData {
    month!: string;
    monthlyData!: algorithmOutput;
}
