import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { schoolValidationSchema } from 'validationSchema/schools';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSchools();
    case 'POST':
      return createSchool();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSchools() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.school
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'school'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createSchool() {
    await schoolValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.it_staff?.length > 0) {
      const create_it_staff = body.it_staff;
      body.it_staff = {
        create: create_it_staff,
      };
    } else {
      delete body.it_staff;
    }
    if (body?.student?.length > 0) {
      const create_student = body.student;
      body.student = {
        create: create_student,
      };
    } else {
      delete body.student;
    }
    if (body?.teacher?.length > 0) {
      const create_teacher = body.teacher;
      body.teacher = {
        create: create_teacher,
      };
    } else {
      delete body.teacher;
    }
    const data = await prisma.school.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
