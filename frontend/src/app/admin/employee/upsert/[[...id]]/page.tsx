'use client';

import { useWatch } from 'react-hook-form';

import UpsertForm from '../(components)/upsert-form';
import FullscreenLoader from '@/components/fullscreen-loader';
import QualificationForm from '../(components)/quanlification-table';

import { cn } from '@/lib/utils';
import { useEmployeeUpsert } from '@/hooks/employee/useEmployeeUpsert';

export default function UpsetEmployee() {

  const {
    form,
    isQueryLoading,
    isPending,
    employeeId,
    onSubmit
  } = useEmployeeUpsert();

  const [firstName, middleName, lastName] = useWatch({
    control: form.control,
    name: ['firstName', 'middleName', 'lastName']
  });

  if (isQueryLoading) {
    return <FullscreenLoader />
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <div
        className={cn("w-full bg-white rounded-xl shadow-lg", employeeId ? "max-w-6xl grid grid-cols-2" : "max-w-4xl")}
      >
        <div
          className={cn("h-12 bg-teal-400 text-white flex items-center px-6 rounded-t-xl", employeeId && "col-span-2")}
        >
          <h2 className="text-lg font-semibold">{employeeId ? [firstName, middleName, lastName].filter(Boolean).join(' ').trim() || '' : 'Add Employee'}</h2>
        </div>

        <div className="p-6">
          <UpsertForm
            form={form}
            isPending={isPending}
            onSubmit={onSubmit}
          />
        </div>

        {employeeId && <QualificationForm employeeId={employeeId} />}
      </div>
    </div>
  );
}
