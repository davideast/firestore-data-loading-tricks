import { CollectionReference, where, query, QueryConstraint, FieldPath, WhereFilterOp, limit, Query } from 'firebase/firestore';

type Builder = {
  where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown): Builder;
  limit(number: number): Builder;
  build(): Query;
}

export function builder(ref: CollectionReference) {
  let whereClauses: QueryConstraint[] = [];
  let theLimit = null;
  return {
    where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown): Builder {
      whereClauses = [...whereClauses, where(fieldPath, opStr, value)];
      return this as Builder;
    },
    limit(number: number): Builder {
      theLimit = limit(number);
      return this as Builder;
    },
    build(): Query {
      return this;
    }
  };

}

const q = builder(null as CollectionReference);
q.where('a', '==', 'a').limit(10)
