import { Router } from 'express';
import { Http } from '../types';

export function createHttpRoute(router: Router, http: Http): Function {
  switch (http) {
    case Http.Post:
      return router.post.bind(router);
    case Http.Get:
      return router.get.bind(router);
    case Http.Put:
      return router.put.bind(router);
    case Http.Delete:
      return router.delete.bind(router);
    case Http.Patch:
      return router.patch.bind(router);
    case Http.Options:
      return router.options.bind(router);
  }
}
