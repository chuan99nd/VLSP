import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { toast } from 'react-toastify';
import apis from '../../apis';
import routes from '../../constants/routes';

const Admin = ({ history }) => {
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modalLockVisible, setModalLockVisible] = useState(false);
  const [modalUnlockVisible, setModalUnlockVisible] = useState(false);
  const [pickedUser, setPickedUser] = useState(null);
  const [reload, setReaload] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const responseData = await apis.admin.getAllUserExceptAdmin();
      console.log('all users: ', responseData);
      if (responseData.status === 1) {
        setUsers(responseData.allUsers);
      } else {
        toast.error(responseData.message);
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, [reload]);

  const showModalLock = () => {
    setModalLockVisible(true);
  };

  const hideModalLock = () => {
    setModalLockVisible(false);
  };

  const showModalUnlock = () => {
    setModalUnlockVisible(true);
  };

  const hideModalUnlock = () => {
    setModalUnlockVisible(false);
  };

  const onLockUserHandler = async () => {
    // console.log(pickedUser);
    setIsLoading(true);
    try {
      const responseData = await apis.admin.lockUser({
        userId: pickedUser.id,
      });
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setReaload(!reload);
      } else {
        toast.error(responseData.message);
      }
      hideModalLock();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onUnlockUserHandler = async () => {
    // console.log(pickedUser);
    setIsLoading(true);
    try {
      const responseData = await apis.admin.unlockUser({
        userId: pickedUser.id,
      });
      if (responseData.status === 1) {
        toast.success(responseData.message);
        setReaload(!reload);
      } else {
        toast.error(responseData.message);
      }
      hideModalUnlock();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onJumpToCreateUserPageHandler = () => {
    history.push(routes.CREATE_USER);
  };

  return (
    <div
      className="container"
      style={{ background: 'white', minHeight: '800px' }}
    >
      <Spin spinning={isLoading}>
        {users && (
          <div>
            <h1
              style={{
                paddingTop: '2rem',
                fontFamily: 'sans-serif',
                textAlign: 'center',
              }}
            >
              Qu???n l?? ng?????i d??ng
            </h1>

            <Row style={{ margin: '1rem 0 1rem 0' }}>
              <Col span={2} offset={20}>
                <Button
                  shape="round"
                  type="primary"
                  onClick={onJumpToCreateUserPageHandler}
                >
                  T???o t??i kho???n
                </Button>
              </Col>
            </Row>

            <Table
              dataSource={users}
              columns={[
                {
                  title: 'T??n ng?????i d??ng',
                  dataIndex: 'name',
                },
                {
                  title: 'E-mail',
                  dataIndex: 'email',
                },
                {
                  title: 'Vai tr??',
                  dataIndex: 'role',
                },
                {
                  title: 'Ng??y ????ng k??',
                  dataIndex: 'createdAt',
                  render: (dateString) => {
                    const date = new Date(dateString);
                    return <Moment format="YYYY/MM/DD">{date}</Moment>;
                  },
                },
                {
                  title: '',
                  render: (_, record) => {
                    if (record.actived) {
                      return (
                        <Button
                          onClick={() => {
                            setPickedUser(record);
                            setModalLockVisible(true);
                          }}
                        >
                          Kh??a
                        </Button>
                      );
                    }
                    return (
                      <Button
                        onClick={() => {
                          setPickedUser(record);
                          setModalUnlockVisible(true);
                        }}
                      >
                        M??? kh??a
                      </Button>
                    );
                  },
                },
              ]}
            />
          </div>
        )}
      </Spin>
      {pickedUser && (
        <Modal
          visible={modalLockVisible}
          title="Confirm"
          onOk={onLockUserHandler}
          onCancel={hideModalLock}
        >
          B???n c?? ch???c ch???n mu???n kh??a t??i kho???n {pickedUser.name}
        </Modal>
      )}
      {pickedUser && (
        <Modal
          visible={modalUnlockVisible}
          title="Confirm"
          onOk={onUnlockUserHandler}
          onCancel={hideModalUnlock}
        >
          B???n c?? ch???c ch???n mu???n m??? kh??a t??i kho???n {pickedUser.name}
        </Modal>
      )}
    </div>
  );
};

export default Admin;
