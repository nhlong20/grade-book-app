import { API } from '../environment'
import { toast } from 'react-toastify';

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation} from 'react-query'

import axios from 'axios'
type FormData = { name: string; email: string; password: string; }

export default function Profile() {
    const { register, handleSubmit, reset  } = useForm<FormData>()
    const [showModal, setShowModal] = useState(false);
    const [success, setSuccess] = useState(false)


    const { mutateAsync, isLoading } = useMutation(
        ['signup'],
        (data: FormData) => axios.post(`${API}/auth/signup`, data),
        {
            onSuccess(res) {
                setSuccess(true)
                toast.success("Đăng ký thành côngg");
                setShowModal(false);
                reset()
            },
            onError(err: any) {
                toast.error(err.response.statusText + ": "+ err.response.data.message);
            },
        },
    )

    const signUp = useCallback((data: FormData) => {
        mutateAsync(data)
    }, [])

    return (
        <>
      
            <button className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700 mx-1"
                onClick={() => setShowModal(true)}>
                Đăng ký
            </button>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">

                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                                <div className="flex flex-col align-center p-5 border-b border-solid border-blueGray-200 rounded-t text-center">
                                    <h3 className="text-4xl font-bold uppercase text-green-500 py-5">
                                        Gradebooks
                                    </h3>
                                    <p>Bạn đã có tài khoản?  <span className="underline cursor-pointer" onClick={() => setShowModal(false)}>Đăng nhập</span> </p>

                                </div>
                                <form className="relative p-6 flex-auto"
                                    onSubmit={handleSubmit(signUp)}>
                                    <input
                                        type="text"
                                        className="block border border-grey-light w-full p-3 rounded mb-4"
                                        placeholder="Tên của bạn *"
                                        {...register('name')}
                                        required />

                                    <input
                                        type="email"
                                        className="block border border-grey-light w-full p-3 rounded mb-4"
                                        placeholder="Email của bạn *"
                                        {...register('email')}
                                        required />

                                    <input
                                        type="password"
                                        className="block border border-grey-light w-full p-3 rounded mb-4"
                                        placeholder="Mật khẩu *"
                                        {...register('password')}
                                        required />

                                    <div className="my-4">
                                        <p className="text-center text-sm text-grey-dark">
                                            Bằng cách ấn đăng ký, bạn đã đồng ý với
                                        </p>
                                        <p className="text-center text-sm text-grey-dark">
                                            <a className="no-underline border-b border-grey-dark text-grey-dark font-semibold" href="#">
                                                <span>Điều khoản dịch vụ</span>
                                            </a> và
                                            <a className="no-underline border-b border-grey-dark text-grey-dark font-semibold" href="#">
                                                <span> Quy định chính sách </span>
                                            </a>
                                            của chúng tôi
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1 uppercase font-bold"
                                    >Đăng ký</button>
                                    <button
                                        type="submit"
                                        className="w-full text-center py-3 rounded bg-red-500 text-white hover:bg-red-dark focus:outline-none my-1 uppercase font-bold"
                                    >  <span className="fab fa-google mr-2" />Đăng ký với Google</button>
                                    <button
                                        type="submit"
                                        className="w-full text-center py-3 rounded bg-gray-500 text-white hover:bg-gray-dark focus:outline-none my-1 uppercase font-bold"
                                        onClick={() => setShowModal(false)}
                                    >Huỷ</button>

                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}
