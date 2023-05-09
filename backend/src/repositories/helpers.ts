export const selectAccountOptions = { user_id: true, balance: true, currency: true, id: true };

export const operators = {
  '===': 'equals',
  '!==': 'not',
  '>=': 'gte',
  '<=': 'lte',
  in: 'in',
};

export const addFilters = (filters: { filterBy: any; value: any; operator: keyof typeof operators }[]) => {
  return filters.reduce((acumulator: { [key: string]: any }, current) => {
    const operator = current.operator;
    const key = current.filterBy;
    const value = current.value;
    acumulator[key] = { ...acumulator[key], [operators[operator]]: value };
    return acumulator;
  }, {});
};
