import React, { useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create context
const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    // Create an instance of Axios with default headers
    // Create an instance of Axios with default headers
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include token with 'Bearer ' prefix
    },
  });

    // Add income
    const addIncome = async (income) => {
        try {
            await axiosInstance.post(`/add-income`, income);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    // Get incomes
    const getIncomes = async () => {
        try {
            const response = await axiosInstance.get(`/get-incomes`);
            setIncomes(response.data);
            console.log(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    // Delete income
    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(`/delete-income/${id}`);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    // Calculate total income
    const totalIncome = () => {
        return incomes.reduce((acc, income) => acc + income.amount, 0);
    };

    // Add expense
    const addExpense = async (expense) => {
        try {
            await axiosInstance.post(`/add-expense`, expense);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    // Get expenses
    const getExpenses = async () => {
        try {
            const response = await axiosInstance.get(`/get-expenses`);
            setExpenses(response.data);
            console.log(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    // Delete expense
    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(`/delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
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
