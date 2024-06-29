export interface UserInfo {
    username: string;
    profilePicHandle: string | null;
};

export interface WithLoadingState {
    loadState: 'idle' | 'loading' | 'failed';
};