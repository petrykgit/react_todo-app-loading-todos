/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    setIsLoading(true);
    inputRef.current?.focus();
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (errorMessage) {
      timerRef.current = setTimeout(() => {
        setErrorMessage(null);
        timerRef.current = null;
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [errorMessage]);

  function addNewTodo(title: string) {
    const todo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setErrorMessage(null);
    setIsAdding(true);
    addTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [newTodo, ...currentTodos]);
        setNewTodoTitle('');
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        inputRef.current?.focus();
      })
      .finally(() => setIsAdding(false));
  }

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (isAdding) {
        return;
      }

      const trimmedTitle = newTodoTitle.trim();

      if (trimmedTitle) {
        addNewTodo(trimmedTitle);
      }
    },
    [newTodoTitle, isAdding],
  );

  const handleHideError = () => {
    setErrorMessage(null);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'completed':
        return todo.completed;
      case 'active':
        return !todo.completed;
      case 'all':
      default:
        return true;
    }
  });

  const allCompleted =
    todos.length > 0 && todos.every(todo => todo.completed === true);

  const someCompleted = todos.some(todo => todo.completed === true);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {isLoading ? (
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))
          )}

          {/* This todo is in loadind state */}
          {isAdding && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                Todo is being saved now
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setFilter(Filter.All);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => {
                  setFilter(Filter.Active);
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  setFilter(Filter.Completed);
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!someCompleted}
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleHideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
