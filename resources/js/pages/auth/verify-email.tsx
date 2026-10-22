import { Form, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verify email" />

            <div className="space-y-6">
                <p className="text-center text-sm text-muted-foreground">
                    Thanks for signing up! Before getting started, please verify your email
                    address by clicking the link we just sent to your inbox. If you didn't
                    receive it, click below to request another.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="text-center text-sm font-medium text-green-600">
                        A new verification link has been sent to your email address.
                    </div>
                )}

                <Form {...send.form()} className="flex flex-col gap-4">
                    {({ processing }) => (
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                            data-test="resend-verification-button"
                        >
                            {processing && <Spinner />}
                            Resend verification email
                        </Button>
                    )}
                </Form>

                <Form {...logout.form()} className="flex justify-center">
                    {({ processing }) => (
                        <button
                            type="submit"
                            className="text-sm text-muted-foreground underline hover:text-foreground disabled:opacity-50"
                            disabled={processing}
                        >
                            Log out
                        </button>
                    )}
                </Form>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify your email',
    description: 'Check your inbox for a verification link',
};
