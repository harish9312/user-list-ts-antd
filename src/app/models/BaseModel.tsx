import { removeInstance, saveInstance, updateInstance } from '../actions/modelActions';
import { store } from '../store';

export class BaseModel<P> {
    static resource: string;
    resource: string;
    static constraint;
    static defaultProps;

    constructor(public props: P & { id?: string }) {
        this.resource = this.constructor['resource'];
        this.props = props;
    }

    getStoreKey(id?): string { return `${this.resource}${id || this.props.id}`; }

    $save(): BaseModel<P> {
        saveInstance(this, this.getStoreKey(), this.resource);
        return this;
    }

    $update(key: string = ''): BaseModel<P> {
        updateInstance(`${key
            ? `${this.resource}${key}`
            : this.getStoreKey()}`, this);
        return this;
    }

    $delete(id: string): void {
        removeInstance(this.getStoreKey(id));
    }

    static get(id: string, state = store.getState()) {
        let modelState = state.models;
        if (!modelState) {
            return;
        }
        let storeKey: string = `${this.resource}${id}`;
        return modelState.toJS
            ? modelState.get(storeKey)
            : modelState[storeKey];
    }

    static list(state = store.getState()) {
        return state
            .models
            .filter(instance => {
                return instance.resource === this.resource
            }).toArray()
    }

}
