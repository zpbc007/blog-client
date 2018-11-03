const transition = (...attr: string[]) => {
    return `${attr && attr.length > 0 ? attr.join(',') : 'all'} 0.2s linear`;
};

export {
    transition,
};