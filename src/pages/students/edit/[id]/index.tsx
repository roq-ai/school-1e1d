import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getStudentById, updateStudentById } from 'apiSdk/students';
import { studentValidationSchema } from 'validationSchema/students';
import { StudentInterface } from 'interfaces/student';
import { UserInterface } from 'interfaces/user';
import { SchoolInterface } from 'interfaces/school';
import { getUsers } from 'apiSdk/users';
import { getSchools } from 'apiSdk/schools';

function StudentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<StudentInterface>(
    () => (id ? `/students/${id}` : null),
    () => getStudentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: StudentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateStudentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/students');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<StudentInterface>({
    initialValues: data,
    validationSchema: studentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Students',
              link: '/students',
            },
            {
              label: 'Update Student',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Student
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.name}
            label={'Name'}
            props={{
              name: 'name',
              placeholder: 'Name',
              value: formik.values?.name,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Attendance"
            formControlProps={{
              id: 'attendance',
              isInvalid: !!formik.errors?.attendance,
            }}
            name="attendance"
            error={formik.errors?.attendance}
            value={formik.values?.attendance}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('attendance', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Academic Record"
            formControlProps={{
              id: 'academic_record',
              isInvalid: !!formik.errors?.academic_record,
            }}
            name="academic_record"
            error={formik.errors?.academic_record}
            value={formik.values?.academic_record}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('academic_record', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Behavior Record"
            formControlProps={{
              id: 'behavior_record',
              isInvalid: !!formik.errors?.behavior_record,
            }}
            name="behavior_record"
            error={formik.errors?.behavior_record}
            value={formik.values?.behavior_record}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('behavior_record', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Health Record"
            formControlProps={{
              id: 'health_record',
              isInvalid: !!formik.errors?.health_record,
            }}
            name="health_record"
            error={formik.errors?.health_record}
            value={formik.values?.health_record}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('health_record', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<SchoolInterface>
            formik={formik}
            name={'school_id'}
            label={'Select School'}
            placeholder={'Select School'}
            fetcher={getSchools}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/students')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'student',
    operation: AccessOperationEnum.UPDATE,
  }),
)(StudentEditPage);
