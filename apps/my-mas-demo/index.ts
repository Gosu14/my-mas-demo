import { Notifier, Ledger, JSON } from '@klave/sdk';
import { algorithmInput, algorithmOutput, algorithmData, monthlyData, ErrorMessage } from './types';

const monthlyDataTableName = "monthly_data_table";

const average = function (data: algorithmData[]): algorithmOutput {
    let globalMonthlySaving = 0, globalMonthlyIncome = 0, globalMonthlyExpense = 0;
    let maleMonthlyIncome = 0, femaleMonthlyIncome = 0;
    let maleMonthlyExpense = 0, femaleMonthlyExpense = 0;
    let maleMonthlySaving = 0, femaleMonthlySaving = 0;
    let maleCount = 0, femaleCount = 0;
    let below20Saving = 0, below20Expense = 0, below20Income = 0;
    let below40Saving = 0, below40Expense = 0, below40Income = 0;
    let below60Saving = 0, below60Expense = 0, below60Income = 0;
    let above60Saving = 0, above60Expense = 0, above60Income = 0;
    let below20Count = 0, below40Count = 0, below60Count = 0, above60Count = 0;
    
    for (let i = 0; i < data.length; ++i)
    {
        if (data[i].isMale) {
            maleMonthlyExpense = maleMonthlyExpense + data[i].monthlyExpense;
            maleMonthlyIncome = maleMonthlyIncome + data[i].monthlyIncome;
            maleMonthlySaving = maleMonthlySaving + data[i].monthlySaving;
            maleCount = maleCount + 1;
        } else {
            femaleMonthlyExpense = femaleMonthlyExpense + data[i].monthlyExpense;
            femaleMonthlySaving = femaleMonthlySaving + data[i].monthlySaving;
            femaleMonthlyIncome = femaleMonthlyIncome + data[i].monthlyIncome;
            femaleCount = femaleCount + 1;
        }

        if (data[i].age < 20) {
            below20Income = below20Income + data[i].monthlyIncome;
            below20Expense = below20Expense + data[i].monthlyExpense;
            below20Saving = below20Saving + data[i].monthlySaving;
            below20Count = below20Count + 1;
        } else if (data[i].age < 40) {
            below40Income = below40Income + data[i].monthlyIncome;
            below40Expense = below40Expense + data[i].monthlyExpense;
            below40Saving = below40Saving + data[i].monthlySaving;
            below40Count = below40Count + 1;
        } else if (data[i].age < 60) {
            below60Income = below60Income + data[i].monthlyIncome;
            below60Expense = below60Expense + data[i].monthlyExpense;
            below60Saving = below60Saving + data[i].monthlySaving;
            below60Count = below60Count + 1;
        } else {
            above60Income = above60Income + data[i].monthlyIncome;
            above60Expense = above60Expense + data[i].monthlyExpense;
            above60Saving = above60Saving + data[i].monthlySaving;
            above60Count = above60Count + 1;
        }

        globalMonthlyExpense = globalMonthlyExpense + data[i].monthlyExpense;
        globalMonthlyIncome = globalMonthlyIncome + data[i].monthlyIncome;
        globalMonthlySaving = globalMonthlySaving + data[i].monthlySaving;
    }

    if (maleCount === 0){ maleCount = 1; }
    if (femaleCount === 0){ femaleCount = 1; }
    if (below20Count === 0){ below20Count = 1; }
    if (below40Count === 0){ below40Count = 1; }
    if (below60Count === 0){ below60Count = 1; }
    if (above60Count === 0){ above60Count = 1; }

    return {
        averageMonthly: [globalMonthlyIncome/data.length, globalMonthlyExpense/data.length, globalMonthlySaving/data.length], 
        averageMaleMonthly: [maleMonthlyIncome/maleCount, maleMonthlyExpense/maleCount, maleMonthlySaving/maleCount], 
        averageFemaleMonthly : [femaleMonthlyIncome/femaleCount, femaleMonthlyExpense/femaleCount, femaleMonthlySaving/femaleCount], 
        averageMonthlyPerAgeGroup: [[below20Income/below20Count, below20Expense/below20Count, below20Saving/below20Count], [below40Income/below40Count, below40Expense/below40Count, below40Saving/below40Count], [below60Income/below60Count, below60Expense/below60Count, below60Saving/below60Count], [above60Income/above60Count, above60Expense/above60Count, above60Saving/above60Count]],
        totalMonthly: [globalMonthlyIncome, globalMonthlyExpense, globalMonthlySaving]
    }
}

/**
 * @query
 * @param {algorithmInput} input - A parsed input argument
 */
export function averageAlgorithm(input: algorithmInput): void {
    Notifier.sendJson<algorithmOutput>(average(input.input));
}

/**
 * @transaction
 * @param {monthlyData} input - A parsed input argument
 */
export function saveMonthlyData(input: monthlyData): void {
    Ledger.getTable(monthlyDataTableName).set(input.month, JSON.stringify(input.monthlyData));
    Notifier.sendString("Data for the month " + input.month + " saved successfully");
}

/**
 * @query
 */
export function getSavedMonthlyData(month: string): void {
    const dataTable = Ledger.getTable(monthlyDataTableName)
    const data = dataTable.get(month);
    
    if (data.length === 0) {
        Notifier.sendJson<ErrorMessage>({
            success: false,
            message: "No data found for the month " + month
        });
        return;
    }
    
    Notifier.sendJson<algorithmOutput>(JSON.parse<algorithmOutput>(data));
}
