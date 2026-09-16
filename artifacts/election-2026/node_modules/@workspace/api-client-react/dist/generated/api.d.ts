import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AdminLoginInput, AdminSession, Candidate, CandidateInput, CandidateUpdate, ElectionResults, ElectionSettings, ElectionSettingsUpdate, HealthStatus, ResetResult, ResultsSummary, Student, StudentInput, StudentLoginInput, StudentSession, StudentUpdate, VoteInput, VoteResult, VoteStatus } from './api.schemas';
import { customFetch } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = unknown;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getStudentLoginUrl: () => string;
/**
 * @summary Student login with student ID
 */
export declare const studentLogin: (studentLoginInput: StudentLoginInput, options?: Parameters<typeof customFetch>[1]) => Promise<StudentSession>;
export declare const getStudentLoginMutationKey: () => readonly ["studentLogin"];
export declare const getStudentLoginMutationOptions: <TError = void, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof studentLogin>>, TError, StudentLoginMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof studentLogin>>, TError, StudentLoginMutationVariables, TContext>;
export type StudentLoginMutationResult = NonNullable<Awaited<ReturnType<typeof studentLogin>>>;
export type StudentLoginMutationBody = StudentLoginInput;
export type StudentLoginMutationError = void;
export type StudentLoginMutationVariables = {
    data: StudentLoginInput;
};
/**
* @summary Student login with student ID
*/
export declare const useStudentLogin: <TError = void, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof studentLogin>>, TError, StudentLoginMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof studentLogin>>, TError, StudentLoginMutationVariables, TContext>;
export declare const getAdminLoginUrl: () => string;
/**
 * @summary Admin login
 */
export declare const adminLogin: (adminLoginInput: AdminLoginInput, options?: Parameters<typeof customFetch>[1]) => Promise<AdminSession>;
export declare const getAdminLoginMutationKey: () => readonly ["adminLogin"];
export declare const getAdminLoginMutationOptions: <TError = void, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = AdminLoginInput;
export type AdminLoginMutationError = void;
export type AdminLoginMutationVariables = {
    data: AdminLoginInput;
};
/**
* @summary Admin login
*/
export declare const useAdminLogin: <TError = void, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
export declare const getGetCandidatesUrl: () => string;
/**
 * @summary List all candidates
 */
export declare const getCandidates: (options?: Parameters<typeof customFetch>[1]) => Promise<Candidate[]>;
export declare const getGetCandidatesQueryKey: () => readonly ["/api/candidates"];
export declare const getGetCandidatesQueryOptions: <TData = Awaited<ReturnType<typeof getCandidates>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCandidates>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCandidatesQueryResult = NonNullable<Awaited<ReturnType<typeof getCandidates>>>;
export type GetCandidatesQueryError = unknown;
/**
 * @summary List all candidates
 */
export declare function useGetCandidates<TData = Awaited<ReturnType<typeof getCandidates>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCandidateUrl: () => string;
/**
 * @summary Create a candidate (admin)
 */
export declare const createCandidate: (candidateInput: CandidateInput, options?: Parameters<typeof customFetch>[1]) => Promise<Candidate>;
export declare const getCreateCandidateMutationKey: () => readonly ["createCandidate"];
export declare const getCreateCandidateMutationOptions: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCandidate>>, TError, CreateCandidateMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCandidate>>, TError, CreateCandidateMutationVariables, TContext>;
export type CreateCandidateMutationResult = NonNullable<Awaited<ReturnType<typeof createCandidate>>>;
export type CreateCandidateMutationBody = CandidateInput;
export type CreateCandidateMutationError = unknown;
export type CreateCandidateMutationVariables = {
    data: CandidateInput;
};
/**
* @summary Create a candidate (admin)
*/
export declare const useCreateCandidate: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCandidate>>, TError, CreateCandidateMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCandidate>>, TError, CreateCandidateMutationVariables, TContext>;
export declare const getGetCandidateUrl: (id: number) => string;
/**
 * @summary Get a candidate by ID
 */
export declare const getCandidate: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<Candidate>;
export declare const getGetCandidateQueryKey: (id: number) => readonly [`/api/candidates/${number}`];
export declare const getGetCandidateQueryOptions: <TData = Awaited<ReturnType<typeof getCandidate>>, TError = unknown>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidate>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCandidate>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCandidateQueryResult = NonNullable<Awaited<ReturnType<typeof getCandidate>>>;
export type GetCandidateQueryError = unknown;
/**
 * @summary Get a candidate by ID
 */
export declare function useGetCandidate<TData = Awaited<ReturnType<typeof getCandidate>>, TError = unknown>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidate>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateCandidateUrl: (id: number) => string;
/**
 * @summary Update a candidate (admin)
 */
export declare const updateCandidate: (id: number, candidateUpdate: CandidateUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Candidate>;
export declare const getUpdateCandidateMutationKey: () => readonly ["updateCandidate"];
export declare const getUpdateCandidateMutationOptions: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCandidate>>, TError, UpdateCandidateMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCandidate>>, TError, UpdateCandidateMutationVariables, TContext>;
export type UpdateCandidateMutationResult = NonNullable<Awaited<ReturnType<typeof updateCandidate>>>;
export type UpdateCandidateMutationBody = CandidateUpdate;
export type UpdateCandidateMutationError = unknown;
export type UpdateCandidateMutationVariables = {
    id: number;
    data: CandidateUpdate;
};
/**
* @summary Update a candidate (admin)
*/
export declare const useUpdateCandidate: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCandidate>>, TError, UpdateCandidateMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCandidate>>, TError, UpdateCandidateMutationVariables, TContext>;
export declare const getDeleteCandidateUrl: (id: number) => string;
/**
 * @summary Delete a candidate (admin)
 */
export declare const deleteCandidate: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteCandidateMutationKey: () => readonly ["deleteCandidate"];
export declare const getDeleteCandidateMutationOptions: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCandidate>>, TError, DeleteCandidateMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCandidate>>, TError, DeleteCandidateMutationVariables, TContext>;
export type DeleteCandidateMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCandidate>>>;
export type DeleteCandidateMutationError = unknown;
export type DeleteCandidateMutationVariables = {
    id: number;
};
/**
* @summary Delete a candidate (admin)
*/
export declare const useDeleteCandidate: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCandidate>>, TError, DeleteCandidateMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCandidate>>, TError, DeleteCandidateMutationVariables, TContext>;
export declare const getGetStudentsUrl: () => string;
/**
 * @summary List all students (admin)
 */
export declare const getStudents: (options?: Parameters<typeof customFetch>[1]) => Promise<Student[]>;
export declare const getGetStudentsQueryKey: () => readonly ["/api/students"];
export declare const getGetStudentsQueryOptions: <TData = Awaited<ReturnType<typeof getStudents>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStudents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStudentsQueryResult = NonNullable<Awaited<ReturnType<typeof getStudents>>>;
export type GetStudentsQueryError = unknown;
/**
 * @summary List all students (admin)
 */
export declare function useGetStudents<TData = Awaited<ReturnType<typeof getStudents>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateStudentUrl: () => string;
/**
 * @summary Create a student (admin)
 */
export declare const createStudent: (studentInput: StudentInput, options?: Parameters<typeof customFetch>[1]) => Promise<Student>;
export declare const getCreateStudentMutationKey: () => readonly ["createStudent"];
export declare const getCreateStudentMutationOptions: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStudent>>, TError, CreateStudentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createStudent>>, TError, CreateStudentMutationVariables, TContext>;
export type CreateStudentMutationResult = NonNullable<Awaited<ReturnType<typeof createStudent>>>;
export type CreateStudentMutationBody = StudentInput;
export type CreateStudentMutationError = unknown;
export type CreateStudentMutationVariables = {
    data: StudentInput;
};
/**
* @summary Create a student (admin)
*/
export declare const useCreateStudent: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStudent>>, TError, CreateStudentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createStudent>>, TError, CreateStudentMutationVariables, TContext>;
export declare const getUpdateStudentUrl: (id: number) => string;
/**
 * @summary Update a student (admin)
 */
export declare const updateStudent: (id: number, studentUpdate: StudentUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Student>;
export declare const getUpdateStudentMutationKey: () => readonly ["updateStudent"];
export declare const getUpdateStudentMutationOptions: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStudent>>, TError, UpdateStudentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateStudent>>, TError, UpdateStudentMutationVariables, TContext>;
export type UpdateStudentMutationResult = NonNullable<Awaited<ReturnType<typeof updateStudent>>>;
export type UpdateStudentMutationBody = StudentUpdate;
export type UpdateStudentMutationError = unknown;
export type UpdateStudentMutationVariables = {
    id: number;
    data: StudentUpdate;
};
/**
* @summary Update a student (admin)
*/
export declare const useUpdateStudent: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStudent>>, TError, UpdateStudentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateStudent>>, TError, UpdateStudentMutationVariables, TContext>;
export declare const getDeleteStudentUrl: (id: number) => string;
/**
 * @summary Delete a student (admin)
 */
export declare const deleteStudent: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteStudentMutationKey: () => readonly ["deleteStudent"];
export declare const getDeleteStudentMutationOptions: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteStudent>>, TError, DeleteStudentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteStudent>>, TError, DeleteStudentMutationVariables, TContext>;
export type DeleteStudentMutationResult = NonNullable<Awaited<ReturnType<typeof deleteStudent>>>;
export type DeleteStudentMutationError = unknown;
export type DeleteStudentMutationVariables = {
    id: number;
};
/**
* @summary Delete a student (admin)
*/
export declare const useDeleteStudent: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteStudent>>, TError, DeleteStudentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteStudent>>, TError, DeleteStudentMutationVariables, TContext>;
export declare const getCastVoteUrl: () => string;
/**
 * @summary Cast a vote
 */
export declare const castVote: (voteInput: VoteInput, options?: Parameters<typeof customFetch>[1]) => Promise<VoteResult>;
export declare const getCastVoteMutationKey: () => readonly ["castVote"];
export declare const getCastVoteMutationOptions: <TError = void, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof castVote>>, TError, CastVoteMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof castVote>>, TError, CastVoteMutationVariables, TContext>;
export type CastVoteMutationResult = NonNullable<Awaited<ReturnType<typeof castVote>>>;
export type CastVoteMutationBody = VoteInput;
export type CastVoteMutationError = void;
export type CastVoteMutationVariables = {
    data: VoteInput;
};
/**
* @summary Cast a vote
*/
export declare const useCastVote: <TError = void, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof castVote>>, TError, CastVoteMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof castVote>>, TError, CastVoteMutationVariables, TContext>;
export declare const getCheckVoteStatusUrl: (studentId: number) => string;
/**
 * @summary Check if student has voted
 */
export declare const checkVoteStatus: (studentId: number, options?: Parameters<typeof customFetch>[1]) => Promise<VoteStatus>;
export declare const getCheckVoteStatusQueryKey: (studentId: number) => readonly [`/api/votes/check/${number}`];
export declare const getCheckVoteStatusQueryOptions: <TData = Awaited<ReturnType<typeof checkVoteStatus>>, TError = unknown>(studentId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof checkVoteStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof checkVoteStatus>>, TError, TData> & {
    queryKey: QueryKey;
};
export type CheckVoteStatusQueryResult = NonNullable<Awaited<ReturnType<typeof checkVoteStatus>>>;
export type CheckVoteStatusQueryError = unknown;
/**
 * @summary Check if student has voted
 */
export declare function useCheckVoteStatus<TData = Awaited<ReturnType<typeof checkVoteStatus>>, TError = unknown>(studentId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof checkVoteStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetResultsUrl: () => string;
/**
 * @summary Get live election results with vote counts
 */
export declare const getResults: (options?: Parameters<typeof customFetch>[1]) => Promise<ElectionResults>;
export declare const getGetResultsQueryKey: () => readonly ["/api/results"];
export declare const getGetResultsQueryOptions: <TData = Awaited<ReturnType<typeof getResults>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getResults>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getResults>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetResultsQueryResult = NonNullable<Awaited<ReturnType<typeof getResults>>>;
export type GetResultsQueryError = unknown;
/**
 * @summary Get live election results with vote counts
 */
export declare function useGetResults<TData = Awaited<ReturnType<typeof getResults>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getResults>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetResultsSummaryUrl: () => string;
/**
 * @summary Get high-level election stats and turnout
 */
export declare const getResultsSummary: (options?: Parameters<typeof customFetch>[1]) => Promise<ResultsSummary>;
export declare const getGetResultsSummaryQueryKey: () => readonly ["/api/results/summary"];
export declare const getGetResultsSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getResultsSummary>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getResultsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getResultsSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetResultsSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getResultsSummary>>>;
export type GetResultsSummaryQueryError = unknown;
/**
 * @summary Get high-level election stats and turnout
 */
export declare function useGetResultsSummary<TData = Awaited<ReturnType<typeof getResultsSummary>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getResultsSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetElectionSettingsUrl: () => string;
/**
 * @summary Get current election settings
 */
export declare const getElectionSettings: (options?: Parameters<typeof customFetch>[1]) => Promise<ElectionSettings>;
export declare const getGetElectionSettingsQueryKey: () => readonly ["/api/election"];
export declare const getGetElectionSettingsQueryOptions: <TData = Awaited<ReturnType<typeof getElectionSettings>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getElectionSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getElectionSettings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetElectionSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getElectionSettings>>>;
export type GetElectionSettingsQueryError = unknown;
/**
 * @summary Get current election settings
 */
export declare function useGetElectionSettings<TData = Awaited<ReturnType<typeof getElectionSettings>>, TError = unknown>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getElectionSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateElectionSettingsUrl: () => string;
/**
 * @summary Update election settings (admin)
 */
export declare const updateElectionSettings: (electionSettingsUpdate: ElectionSettingsUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<ElectionSettings>;
export declare const getUpdateElectionSettingsMutationKey: () => readonly ["updateElectionSettings"];
export declare const getUpdateElectionSettingsMutationOptions: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateElectionSettings>>, TError, UpdateElectionSettingsMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateElectionSettings>>, TError, UpdateElectionSettingsMutationVariables, TContext>;
export type UpdateElectionSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateElectionSettings>>>;
export type UpdateElectionSettingsMutationBody = ElectionSettingsUpdate;
export type UpdateElectionSettingsMutationError = unknown;
export type UpdateElectionSettingsMutationVariables = {
    data: ElectionSettingsUpdate;
};
/**
* @summary Update election settings (admin)
*/
export declare const useUpdateElectionSettings: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateElectionSettings>>, TError, UpdateElectionSettingsMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateElectionSettings>>, TError, UpdateElectionSettingsMutationVariables, TContext>;
export declare const getResetElectionUrl: () => string;
/**
 * @summary Reset all votes (admin)
 */
export declare const resetElection: (options?: Parameters<typeof customFetch>[1]) => Promise<ResetResult>;
export declare const getResetElectionMutationKey: () => readonly ["resetElection"];
export declare const getResetElectionMutationOptions: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof resetElection>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof resetElection>>, TError, void, TContext>;
export type ResetElectionMutationResult = NonNullable<Awaited<ReturnType<typeof resetElection>>>;
export type ResetElectionMutationError = unknown;
/**
* @summary Reset all votes (admin)
*/
export declare const useResetElection: <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof resetElection>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof resetElection>>, TError, void, TContext>;
export {};
