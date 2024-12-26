"use client";
import React, { useState } from 'react';
import { TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import clsx from 'clsx';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface FormData {
  name: string;
  email: string;
  message: string;
  topic: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    topic: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'وارد کردن نام الزامی است';
    if (!formData.email.trim()) newErrors.email = 'وارد کردن ایمیل الزامی است';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'ایمیل وارد شده معتبر نیست';
    if (!formData.topic.trim()) newErrors.topic = 'انتخاب موضوع الزامی است';
    if (!formData.message.trim()) newErrors.message = 'وارد کردن پیام الزامی است';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        confirmAlert({
          title: 'ارسال موفقیت‌آمیز',
          message: 'فرم با موفقیت ارسال شد!',
          buttons: [
            {
              label: 'باشه',
              onClick: () => {
                setFormData({ name: '', email: '', message: '', topic: '' });
                setErrors({});
              },
            },
          ],
        });
      } catch (error) {
        confirmAlert({
          title: 'خطا',
          message: 'ارسال فرم با خطا مواجه شد. لطفاً دوباره تلاش کنید.',
          buttons: [
            {
              label: 'باشه',
              onClick: () => {},
            },
          ],
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-md rtl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">تماس با ما</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <TextField
            fullWidth
            label="نام"
            name="name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            InputLabelProps={{ className: 'text-right' }}
          />
        </div>

        <div>
          <TextField
            fullWidth
            label="ایمیل"
            name="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            InputLabelProps={{ className: 'text-right' }}
          />
        </div>

        <div>
          <TextField
            select
            fullWidth
            label="موضوع"
            name="topic"
            variant="outlined"
            value={formData.topic}
            onChange={handleChange}
            error={Boolean(errors.topic)}
            helperText={errors.topic}
            InputLabelProps={{ className: 'text-right' }}
          >
            <MenuItem value="پشتیبانی">پشتیبانی</MenuItem>
            <MenuItem value="مشاوره">مشاوره</MenuItem>
            <MenuItem value="پیشنهادات">پیشنهادات</MenuItem>
          </TextField>
        </div>

        <div>
          <TextField
            fullWidth
            label="پیام"
            name="message"
            variant="outlined"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange}
            error={Boolean(errors.message)}
            helperText={errors.message}
            InputLabelProps={{ className: 'text-right' }}
          />
        </div>

        <div className="md:col-span-2">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={clsx('w-full py-2 bg-blue-500 hover:bg-blue-600 text-white')}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} className="text-white" /> : 'ارسال'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
