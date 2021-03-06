import { FileOutlined, RightOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Spin, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import apis from '../../../../apis';
import { PUBLIC_DOMAIN } from '../../../../configs';
import routes from '../../../../constants/routes';

const dummyReq = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

const RequestData = ({ history }) => {
  const { tid: teamId } = useParams();
  const [loadedCompetition, setLoadedCompetition] = useState();
  const [loadedTeam, setLoadedTeam] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [uploadedCommit, setUploadedCommit] = useState();

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setIsLoading(true);
        const responseData = await apis.user.getTeamById(teamId);
        console.log('team info', responseData);
        if (responseData.status === 1) {
          setLoadedTeam(responseData.team);
        } else {
          toast.error(responseData.message);
          setIsLoading(false);
          return;
        }
        if (!responseData) {
          setIsLoading(false);
          return;
        }
        const responseData2 = await apis.user.getCompetitionById({
          competitionId: responseData.team.competitionId,
        });
        console.log('competition info', responseData2);
        if (responseData2.status === 1) {
          setLoadedCompetition(responseData2.competition);
        } else {
          toast.error(responseData.message);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompetition();
  }, [teamId]);

  const uploadFileChangeHandler = (data) => {
    setUploadedCommit(data.fileList);
  };

  const requestDataHandler = async () => {
    console.log(uploadedCommit);
    if (!uploadedCommit || uploadedCommit.length !== 1) {
      toast.error('Ch??? upload 1 file pdf duy nh???t');
      return;
    }
    if (uploadedCommit[0].type !== 'application/pdf') {
      toast.error('Ch??? ???????c upload file pdf');
      return;
    }
    const formBody = new FormData();
    formBody.append('commitment', uploadedCommit[0].originFileObj);
    formBody.append('teamId', teamId);
    setIsLoading(true);
    try {
      const responseData = await apis.user.requestData(formBody);
      console.log(responseData);
      if (responseData.status === 1) {
        toast.success(responseData.message);
        history.push(
          routes.COMPETITION_USER.replace('/:cid', `/${loadedCompetition.id}`),
        );
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  if (
    loadedCompetition &&
    loadedCompetition.timeline.verifyData &&
    loadedTeam &&
    (100 * loadedTeam.audiosVerifiedId.length) /
      loadedTeam.numberOfAudiotoVerify <
      loadedCompetition.taskVerifyData.threshold
  ) {
    return (
      <div className="container" style={{ background: 'white' }}>
        <h5>
          B???n ch??a ho??n th??nh nhi???m v??? th???m ?????nh d??? li???u, vui l??ng th???m ?????nh d???
          li???u ????? c?? th??? y??u c???u d??? li???u hu???n luy???n
        </h5>
      </div>
    );
  }

  return (
    <div className="container" style={{ background: 'white' }}>
      {loadedCompetition && loadedTeam && (
        <Spin spinning={isLoading}>
          <Row style={{ paddingTop: '2rem' }}>
            <Col span={8}>
              <h6>M?? t??? d??? li???u: </h6>
            </Col>
            <Col span={16}>
              <h6>{loadedCompetition.dataToShare.dataDescription}</h6>
            </Col>
          </Row>

          <Row style={{ paddingTop: '2rem' }}>
            <Col span={8}>
              <h6>B???n m???u cam k???t: </h6>
            </Col>
            <Col span={16}>
              <Button
                icon={<FileOutlined />}
                href={`${PUBLIC_DOMAIN}/${loadedCompetition.dataToShare.commitmentTemplateLink}`}
                target="blank"
                style={{ width: '110px', height: '35px' }}
              >
                B???n m???u
              </Button>
            </Col>
          </Row>

          <Row style={{ paddingTop: '2rem' }}>
            <Col span={8}>
              <h6 style={{ paddingTop: '5px' }}>T???i l??n b???n cam k???t: </h6>
            </Col>
            <Col span={16}>
              <Upload
                name="file"
                onChange={uploadFileChangeHandler}
                customRequest={dummyReq}
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{ width: '110px', height: '35px' }}
                >
                  Upload
                </Button>
              </Upload>
            </Col>
          </Row>

          <Row style={{ marginTop: '1rem' }}>
            <Col offset={9}>
              <Button
                icon={<RightOutlined />}
                onClick={requestDataHandler}
                shape="round"
                style={{
                  marginTop: '2rem',
                  marginBottom: '3rem',
                  height: '40px',
                  width: '200px',
                }}
              >
                Y??u c???u d??? li???u
              </Button>
            </Col>
          </Row>
        </Spin>
      )}
    </div>
  );
};

export default RequestData;
