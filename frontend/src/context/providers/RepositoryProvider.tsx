import React, { useContext, useReducer, createContext, Dispatch } from 'react';
import RepositoryInitialState, { RepositoryState } from 'context/initial_states/RepositoryInitialState';
import RepositoryReducer from 'context/reducers/RepositoryReducer';
import RepositoryActions from 'context/actions/RepositoryActions';

interface InputProviderProps {
    children: React.ReactNode;
  }

const RepositoryStateContext = createContext<{
    state: RepositoryState;
}>({ state: RepositoryInitialState });

const RepositoryDispatchContext = createContext<{
    dispatch: React.Dispatch<RepositoryActions>;
}>({ dispatch: () => null})

function RepositoryProvider({ children }: InputProviderProps) {
    const [state, dispatch] = useReducer(RepositoryReducer, RepositoryInitialState);

    return (
        <RepositoryStateContext.Provider value={{ state }}>
            <RepositoryDispatchContext.Provider value={{dispatch}}>
                {children}
            </RepositoryDispatchContext.Provider>
        </RepositoryStateContext.Provider>
    );
}

// Creates hook for using context state.
const useRepositoryState = () => {
	const context = useContext(RepositoryStateContext);
	if (context === undefined) {
		throw new Error(
			'useRepositoryState must be within a RepositoryProvider'
		);
	}

	return context;
};

// Creates a hook for using context dispatch.
const useRepositoryDispatch = () => {
	const context = useContext(RepositoryDispatchContext);
	if (context === undefined) {
		throw new Error(
			'useRepositoryDispatch must be within a RepositoryProvider'
		);
	}

	return context;
};

export { RepositoryProvider, useRepositoryState, useRepositoryDispatch };
