import { Answer, AnswerCreateRequest, Question, User } from "common/models";
import { getLocalStorageItem } from './storage';

export const api = {
    getQuestions: async () => {
        const jwt = getLocalStorageItem<string>("jwt");
        const resp = await fetch('/questions', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${jwt}`
            },
        });
        if (resp.ok) {
            return await resp.json() as Question[];
        } else {
            throw new Error();
        }
    },
    getQuestion: async (questionId: number) => {
        const jwt = getLocalStorageItem<string>("jwt");
        const resp = await fetch(`/questions/${questionId}`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${jwt}`
             },
        });
        if (resp.ok) {
            return await resp.json() as Question | null;
        } else {
            throw new Error();
        }
    },
    getQuestionNext: async () => {
        const jwt = getLocalStorageItem<string>("jwt");
        const resp = await fetch('/questions/next', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${jwt}`
            },
        });
        if (resp.ok) {
            return await resp.json() as Question | null;
        } else {
            throw new Error();
        }
    },
    postAnswer: async(choiceId: number) => {
        const jwt = getLocalStorageItem<string>("jwt");
        const request: AnswerCreateRequest = {
            choiceId,
        };

        const resp = await fetch('/answers', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
             },
        });
        if (resp.ok) {
            return await resp.json() as Answer;
        } else {
            throw new Error();
        }
    },
    deleteQuestion: async (questionId: number) => {
        try {
            const jwt = getLocalStorageItem<string>("jwt");
            const resp = await fetch(`/questions/${questionId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${jwt}`
                },
            });
            
            if (!resp.ok) {
                const error = await resp.json();
                console.error('Server error:', error);
                throw new Error(error.detail || 'Failed to delete question');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
            throw error;
        }
    },
    createQuestion: async (questionText: string, choices: string[]) => {
        try {
            const jwt = getLocalStorageItem<string>("jwt");
            const resp = await fetch('/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({
                    questionText,
                    choices
                })
            });
            
            if (!resp.ok) {
                const error = await resp.json();
                console.error('Server error:', error);
                throw new Error(error.detail || 'Failed to create question');
            }
            
            return await resp.json() as Question;
        } catch (error) {
            console.error('Error creating question:', error);
            throw error;
        }
    },
    isAuthenticated: async () => {
        try {
            const jwt = getLocalStorageItem<string>("jwt");
            const resp = await fetch('/authenticated', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            });
            
            return resp.ok;
        } catch (error) {
            return false;
        }
    },
    isAuthorized: async () => {
        try {
            const jwt = getLocalStorageItem<string>("jwt");
            const resp = await fetch('/authorized', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            });
            
            return resp.ok;
        } catch (error) {
          return false;
        }
    },
    getUsers: async () => {
        try{
            const jwt = getLocalStorageItem<string>("jwt");
            const resp = await fetch(`/users`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${jwt}`
                 },
            });
            if (resp.ok) {
                return await resp.json() as User[];
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error('Network or unexpected error:', error);
            return [];
        }
    },
   updateManagerStatus: async (userId: number, makeManager: boolean): Promise<boolean> => {
        try {
            const jwt = getLocalStorageItem<string>("jwt");
            const response = await fetch(`/manager-status/${userId}?makeManager=${makeManager}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
            });

            if (response.status === 201 || response.status === 200) {
                return true;
            } else if (response.status === 204) {
                return false;
            } else {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                return false;
            }
        } catch (error) {
            console.error('Network or unexpected error:', error);
            return false;
        }
    }
};
