import React, { useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GlobalContext = React.createContext();

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Add income
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}/add-income`, income);
            getIncomes();
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    // Get incomes
    const getIncomes = async () => {
        const response = await axios.get(`${BASE_URL}/get-incomes`);
        setIncomes(response.data);
        console.log(response.data);
    };

    // Delete income
    const deleteIncome = async (id) => {
        await axios.delete(`${BASE_URL}/delete-income/${id}`);
        getIncomes();
    };

    // Calculate total income
    const totalIncome = () => {
        return incomes.reduce((acc, income) => acc + income.amount, 0);
    };

    // Add expense
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}/add-expense`, expense);
            getExpenses();
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    // Get expenses
    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}/get-expenses`);
        setExpenses(response.data);
        console.log(response.data);
    };

    // Delete expense
    const deleteExpense = async (id) => {
        await axios.delete(`${BASE_URL}/delete-expense/${id}`);
        getExpenses();
    };

    // Calculate total expenses
    const totalExpenses = () => {
        return expenses.reduce((acc, expense) => acc + expense.amount, 0);
    };

    // Calculate total balance
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Get transaction history
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
