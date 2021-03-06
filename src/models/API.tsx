import axios from 'axios';
import { JWTContextProps } from '../contexts/JWTContext';

export type Problem = any;
export type Contest = any;
export type SubmissionID = { id: number };
export type Submission = any;
export type User = any;

export default class API {
    private jwtContext: JWTContextProps;

    public static withJWTContext(jwtContext: JWTContextProps): API {
        const api = new API();
        api.jwtContext = jwtContext;
        return api;
    }

    public static noContext(): API {
        const api = new API();
        return api;
    }

    private static resolveURL(url: string): string {
        return new URL(url, process.env.JUDGE_SERVER).href;
    }

    public async login(username: string, password: string): Promise<any> {
        const response = await axios.post(API.resolveURL(`/auth/login`), { username, password });
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async register({ username, password, email, displayName }: any): Promise<any> {
        const response = await axios.post(API.resolveURL(`/auth/register`), {
            username,
            password,
            email,
            display_name: displayName,
        });
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async getContests(): Promise<Contest[]> {
        const response = await axios.get(API.resolveURL(`/contests`), await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async getContest(contestSlug: string): Promise<Contest> {
        const response = await axios.get(API.resolveURL(`/contest/${contestSlug}`), await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async getProblems(): Promise<Problem[]> {
        const response = await axios.get(API.resolveURL(`/problems`), await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async createContest(contestSlug: string): Promise<Contest> {
        const response = await axios.post(API.resolveURL(`/contests`), { slug: contestSlug }, await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async updateContest(contestSlug: string, newContest: Contest): Promise<Contest> {
        const response = await axios.put(API.resolveURL(`/contest/${contestSlug}`), { ...newContest }, await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async getProblem(problemSlug: string): Promise<Problem> {
        const response = await axios.get(API.resolveURL(`/problem/${problemSlug}`), await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async createProblem(problemSlug: string): Promise<Problem> {
        const response = await axios.post(API.resolveURL(`/problems`), { slug: problemSlug }, await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async updateProblem(problemSlug: string, newProblem: Problem): Promise<Problem> {
        const response = await axios.put(API.resolveURL(`/problem/${problemSlug}`), { ...newProblem }, await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async getContestProblem(contestSlug: string, contestProblemSlug: string): Promise<Problem> {
        const response = await axios.get(API.resolveURL(`/contest/${contestSlug}/problem/${contestProblemSlug}`), await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async submitToContest(contestSlug: string, contestProblemSlug: string, language: string, sourceCode: string): Promise<SubmissionID> {
        const response = await axios.post(
            API.resolveURL(`/contest/${contestSlug}/problem/${contestProblemSlug}/submit`),
            { language: language, source_code: sourceCode },
            await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async submitToProblem(problemSlug: string, language: string, sourceCode: string): Promise<SubmissionID> {
        const response = await axios.post(
            API.resolveURL(`/problem/${problemSlug}/submit`),
            { language: language, source_code: sourceCode },
            await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async getUsers(): Promise<User[]> {
        const response = await axios.get(API.resolveURL(`/users`));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async getUser(username: string): Promise<User> {
        const response = await axios.get(
            API.resolveURL(`/user/${username}`),
            await this.jwtContext.withAuthorization({}),
        );
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async updateUser(username: string, newUser: User): Promise<User> {
        const response = await axios.put(
            API.resolveURL(`/user/${username}`),
            newUser,
            await this.jwtContext.withAuthorization({}),
        );
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async getSubmissions(count: number, begin?: number): Promise<Submission[]> {
        const response = await axios.get(API.resolveURL(`/submissions`), await this.jwtContext.withAuthorization({
            params: { count, begin },
        }));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async getSubmission(submissionID: number): Promise<Submission> {
        const response = await axios.get(API.resolveURL(`/submission/${submissionID}`), await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async rejudgeSubmission(submissionID: number): Promise<Submission> {
        const response = await axios.post(API.resolveURL(`/submission/${submissionID}/rejudge`), {}, await this.jwtContext.withAuthorization({}));
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }

    public async uploadTestcases(problemSlug: string, testcasesZipFile: ArrayBuffer): Promise<any> {
        const response = await axios.put(
            API.resolveURL(`/problem/${problemSlug}/testcases`),
            testcasesZipFile,
            await this.jwtContext.withAuthorization({ headers: { 'Content-Type': 'application/zip' } }),
        );
        if (!response.data.success)
            throw response.data;
        return response.data.data;
    }
}
