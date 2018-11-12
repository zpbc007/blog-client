import { withProps } from 'recompose';

export const withStoreIns = (storeIns: any) => {
    return withProps({
        store: storeIns,
    });
};