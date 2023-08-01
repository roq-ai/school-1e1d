import * as yup from 'yup';

export const itStaffValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable(),
  school_id: yup.string().nullable(),
});
