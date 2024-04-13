import React from 'react';
import { TextInput, Checkbox, Button, Group, Box, Card, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import WebcamDemo1 from '../../components/WebcamDemo1';
import { signUp } from '../shared/services/auth.service';
import { useSelector, useDispatch } from 'react-redux';
import { signUpSuccess, selectUser } from '../authSlice';
const SignUp = () => {
    const userData = useSelector(selectUser);
    const dispatch = useDispatch();
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            password: '',
            cpassword: '',
            email: '',
            termsOfService: false,
        },

        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            // password: (value) => (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value) ? null : 'Minimum eight characters, at least one letter, one number and one special character'),
            // cpassword: (value, values) =>
            //     value !== values.password ? 'Passwords did not match' : null,
        },
    });
    // const submitAction = async (formData: any) => {
    const handleSubmit = async (values: typeof form.values) => {
        try {
            const body = {
                email: values.email,
                name: values.name,
                password: values.password
            }
            // const result = await signUp(body);
            dispatch(signUpSuccess({
                "email": "hani7016@gmail.com",
                "id": 7,
                "is_active": true,
                "name": "dfg"
            }),);
            console.log(userData);
        }
        catch (e) {
            console.log("error!")
        }
    }
    return (
        <>
            <Card
                shadow="sm"
                padding="xl"
                component="a"
            >
                <Box maw={340} mx="auto">
                    <form onSubmit={form.onSubmit((handleSubmit))}>
                        <TextInput
                            withAsterisk
                            placeholder="Your name"
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            mt="md"
                            withAsterisk
                            placeholder="Email"
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            mt="md"
                            withAsterisk
                            placeholder="Password"
                            {...form.getInputProps('password')}
                        />
                        <PasswordInput
                            mt="md"
                            withAsterisk
                            placeholder="Confirm Password"
                            {...form.getInputProps('cpassword')}
                        />
                        <Checkbox
                            mt="md"
                            label="I agree to sell my privacy"
                            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                        />

                        <Group justify="flex-end" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                        <span >{userData?.name}</span>
                    </form>
                </Box>
            </Card>
            {/* <WebcamDemo1/> */}

        </>
    );
};

export default SignUp;