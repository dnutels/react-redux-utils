export default function createActionCreator(type) {
    return function(payload, meta) {
        const action = {type};

        if (typeof payload !== 'undefined') {
            action.payload = payload;            
        }

        if (payload instanceof Error) {
            action.error = true;
        }

        if (typeof meta !== 'undefined') {
            action.meta = meta;
        }

        return action;
    };
};
