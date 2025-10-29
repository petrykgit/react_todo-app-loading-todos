import React from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface TodoFilterProps {
  todos: Todo[];
  filter: Filter;
  someCompleted: boolean;
  setFilter: (newFilter: Filter) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  todos,
  filter,
  someCompleted,
  setFilter,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === Filter.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === Filter.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === Filter.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!someCompleted}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
