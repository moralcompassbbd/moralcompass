import { Answer, AnswerPostRequest, Question } from "common/models";

export const api = {
    getQuestions: async () => {
        const jwt = localStorage.getItem("jwt");
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
        const jwt = localStorage.getItem("jwt");
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
        const jwt = localStorage.getItem("jwt");
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
        const jwt = localStorage.getItem("jwt");
        const request: AnswerPostRequest = {
            userId: 1, // todo: use actual user when auth ready
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
            const jwt = localStorage.getItem("jwt");
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
            const jwt = localStorage.getItem("jwt");
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
    }
};
