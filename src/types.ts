export interface UserInfo {
    username: string;
};

export interface WithLoadingState {
    loadState: 'idle' | 'loading' | 'failed';
};