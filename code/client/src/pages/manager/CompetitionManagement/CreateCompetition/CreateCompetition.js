import { RightOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Spin,
  Timeline,
} from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apis from '../../../../apis';
import routes from '../../../../constants/routes';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const { Item } = Form;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 10,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 5,
      offset: 8,
    },
  },
};

const timelineOption = [
  'verifyData',
  'shareTrainingData',
  'submitResult',
  'test',
  'submitReport',
];

const CreateCompetition = ({ history }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [rules, setRules] = useState('');

  const onSubmitHandler = async (form) => {
    console.log(form);
    const timeline = {};
    for (const val of timelineOption) {
      timeline[val] = form.timeline.includes(val);
    }
    // console.log(timeline);
    setIsLoading(true);
    try {
      const responseData = await apis.manager.createCompetition({
        name: form.name,
        rules: rules,
        timeline: timeline,
        joinCompetitionStartDate: new Date(
          form.joinCompetitionStartDate,
        ).toISOString(),
        joinCompetitionEndDate: new Date(
          form.joinCompetitionEndDate,
        ).toISOString(),
      });
      if (responseData.status === 1) {
        toast.success(responseData.message);
        const route = routes.COMPETITION_MANAGER.replace(
          '/:cid',
          `/${responseData.competition.id}`,
        );
        history.push(route);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mt-5" style={{ background: 'white' }}>
      <Spin spinning={isLoading}>
        <h1
          style={{
            paddingTop: '1rem',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          T???o chi???n d???ch
        </h1>
        <Form
          {...formItemLayout}
          onFinish={onSubmitHandler}
          form={form}
          style={{ marginTop: '2rem' }}
        >
          <Item
            name="name"
            label="T??n chi???n d???ch"
            rules={[
              {
                required: true,
                message: 'H??y nh???p t??n chi???n d???ch',
              },
            ]}
          >
            <Input />
          </Item>

          <Item name="rules" label="Th??? l???">
            {/* <Input.TextArea autoSize={{ minRows: 5 }} /> */}
            <CKEditor
              editor={ClassicEditor}
              data={rules}
              onReady={(editor) => {
                console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setRules(data);
              }}
            />
          </Item>

          <Item name="timeline" label="chi???n d???ch bao g???m:">
            <Checkbox.Group>
              <Timeline>
                <Timeline.Item>
                  <Checkbox value="verifyData">Th???m ?????nh d??? li???u</Checkbox>
                </Timeline.Item>
                <Timeline.Item>
                  <Checkbox value="shareTrainingData">
                    Chia s??? d??? li???u hu???n luy???n
                  </Checkbox>
                </Timeline.Item>
                <Timeline.Item>
                  <Checkbox value="submitResult">N???p b??i</Checkbox>
                </Timeline.Item>
                <Timeline.Item>
                  <Checkbox value="test">Th?? nghi???m k???t qu???</Checkbox>
                </Timeline.Item>
                <Timeline.Item>
                  <Checkbox value="submitReport">N???p b??o c??o</Checkbox>
                </Timeline.Item>
              </Timeline>
            </Checkbox.Group>
          </Item>

          <Item
            name="joinCompetitionStartDate"
            label="Ng??y m??? ????ng k??"
            rules={[
              {
                required: true,
                message: 'H??y nh???p ng??y m??? ????ng k??',
              },
            ]}
          >
            <DatePicker />
          </Item>

          <Item
            name="joinCompetitionEndDate"
            label="Ng??y k???t th??c ????ng k??"
            rules={[
              {
                required: true,
                message: 'H??y nh???p ng??y k???t th??c ????ng k??',
              },
            ]}
          >
            <DatePicker />
          </Item>
          <Item {...tailFormItemLayout}>
            <Button
              icon={<RightOutlined />}
              type="default"
              htmlType="submit"
              block={true}
              style={{ height: '45px', marginBottom: '2rem' }}
            >
              T???o chi???n d???ch
            </Button>
          </Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateCompetition;
