import { KfArchInsertDataRepository } from './kfarch-job.repository';
import { KfArchInsertDataEntity } from './kfarch-job.entity';
import { InsertDataPost, KfParseJsonDataContract } from './kfarch-job.interface';
import * as typeorm from 'typeorm';
import {
    createN,
    getInsertDataPost,
    getKfArchInsertDataEntity,
    getKfParseJsonDataContract,
    getNumber,
    getRandomEmptyString,
    getString,
} from './kfarch-job.repository.fixture';
import { KfException } from '@kf-products-core/kfhub_svc_lib/exceptions/kf-exception.exception';
import { Repository } from 'typeorm';

jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
        ...actual,
    };
});

describe('KfArchInsertDataRepository', () => {
    const userId: number = getNumber();
    const id: number = getNumber();
    const offset: number = getNumber();
    const contracts = createN(getKfParseJsonDataContract);

    describe('Construction', () => {
        test('Should be a Repository<KfArchInsertDataEntity>', () => {
            expect(new KfArchInsertDataRepository()).toBeInstanceOf(Repository);
        });
    });

    describe('.createDataEntity method', () => {
        const contract: KfParseJsonDataContract = getKfParseJsonDataContract();

        const getWorkingConditionsScores = (c: KfParseJsonDataContract): string =>
            `${c.wcPhysicalEffort} ${c.wcPhysicalEnvironment}  ${c.wcSensoryAttention}  ${c.wcMentalStress}`;

        const repository = new KfArchInsertDataRepository();
        const result = repository.createDataEntity(contract, userId, id, offset);

        test('entity.KFArchitectProfilesUpdateID', () => {
            expect(result.KFArchitectProfilesUpdateID).toEqual(id);
        });

        test('entity.ProfileRecordID', () => {
            expect(result.ProfileRecordID).toEqual(offset);
        });

        test('entity.ClientJobID', () => {
            expect(result.ClientJobID).toEqual(contract.jobID);
        });

        test('entity.JobName', () => {
            expect(result.JobName).toEqual(contract.jobTitle);
        });

        test('entity.ClientJobStatus', () => {
            expect(result.ClientJobStatus).toEqual(contract.jobStatus);
        });

        test('entity.ClientJobCode', () => {
            expect(result.ClientJobCode).toEqual(contract.jobCode);
        });

        test('entity.ClientJobFunctionName', () => {
            expect(result.ClientJobFunctionName).toEqual(contract.function);
        });

        test('entity.ClientJobSubFunctionName', () => {
            expect(result.ClientJobSubFunctionName).toEqual(contract.subFunction);
        });

        test('entity.KnowHowScores', () => {
            expect(result.KnowHowScores).toEqual(
                `${contract.khPracticalTechnicalKnowledge} ${contract.khManagerialKnowledge} ${contract.khCommunicationInfluencingSkill}`,
            );
        });

        test('entity.KnowHowPoints', () => {
            expect(result.KnowHowPoints).toEqual(contract.khPoints);
        });

        test('entity.KnowHowRationale', () => {
            expect(result.KnowHowRationale).toEqual(contract.khRationales);
        });

        test('entity.ProblemSolvingScores', () => {
            expect(result.ProblemSolvingScores).toEqual(`${contract.psFreedomThink} ${contract.psThinkingChallenge}`);
        });

        test('entity.ProblemSolvingPercentage', () => {
            expect(result.ProblemSolvingPercentage).toEqual(contract.psPercentage);
        });

        test('entity.ProblemSolvingPoints', () => {
            expect(result.ProblemSolvingPoints).toEqual(contract.psPoints);
        });

        test('entity.ProblemSolvingRationale', () => {
            expect(result.ProblemSolvingRationale).toEqual(contract.psRationales);
        });

        test('entity.AccountabilityScores', () => {
            expect(result.AccountabilityScores).toEqual(`${contract.acFreedomAct} ${contract.acAreaImpact} ${contract.acNatureImpact}`);
        });

        test('entity.AccountabilityPoints', () => {
            expect(result.AccountabilityPoints).toEqual(contract.acPoints);
        });

        test('entity.AccountabilityRationale', () => {
            expect(result.AccountabilityRationale).toEqual(contract.acRationales);
        });

        test('entity.WorkingConditionsScores as NonEmpty', () => {
            const scores = getWorkingConditionsScores(contract);
            expect(scores.trim()).toBeTruthy();
            expect(result.WorkingConditionsScores).toEqual(getWorkingConditionsScores(contract));
        });

        test('entity.WorkingConditionsScores as Empty', () => {
            const _contract = Object.assign({}, contract, {
                wcPhysicalEffort: getRandomEmptyString(),
                wcPhysicalEnvironment: getRandomEmptyString(),
                wcSensoryAttention: getRandomEmptyString(),
                wcMentalStress: getRandomEmptyString(),
            } as KfParseJsonDataContract);
            const scores = getWorkingConditionsScores(_contract);
            expect(scores.trim()).toBeFalsy();
            const _result = repository.createDataEntity(_contract, userId, id, offset);
            expect(_result.WorkingConditionsScores).toBeNull();
        });

        test('entity.WorkingConditionsPoints as NonEmpty', () => {
            expect(contract.wcPoints).toBeTruthy();
            expect(result.WorkingConditionsPoints).toEqual(contract.wcPoints);
        });

        test('entity.WorkingConditionsPoints as Empty', () => {
            [0, undefined, null].forEach((v) => {
                const _contract = Object.assign({}, contract, {
                    wcPoints: v,
                } as KfParseJsonDataContract);
                expect(_contract.wcPoints).toBeFalsy();
                const _result = repository.createDataEntity(_contract, userId, id, offset);
                expect(_result.WorkingConditionsPoints).toBeNull();
            });
        });

        test('entity.WorkingConditionsRationale as NonEmpty', () => {
            expect(contract.wcRationale).toBeTruthy();
            expect(result.WorkingConditionsRationale).toEqual(contract.wcRationale);
        });

        test('entity.WorkingConditionsRationale as Empty', () => {
            ['', undefined, null].forEach((v) => {
                const _contract = Object.assign({}, contract, { wcRationale: v } as KfParseJsonDataContract);
                expect(_contract.wcRationale).toBeFalsy();
                const _result = repository.createDataEntity(_contract, userId, id, offset);
                expect(_result.WorkingConditionsRationale).toBeNull();
            });
        });

        test('entity.KFHayPoints', () => {
            expect(result.KFHayPoints).toEqual(contract.kfHayPoints);
        });

        test('entity.GradeSetName', () => {
            expect(result.GradeSetName).toEqual(contract.gradeSet);
        });

        test('entity.Grade', () => {
            expect(result.Grade).toEqual(contract.grade);
        });

        test('entity.ShortProfile', () => {
            expect(result.ShortProfile).toEqual(contract.shortProfile);
        });

        test('entity.BenchmarkIndicator', () => {
            expect(result.BenchmarkIndicator).toEqual(!!contract.benchmarkIndicator);
        });

        test('entity.BenchmarkIndicator as NonEmpty', () => {
            [true, 1, ' ', []].forEach((v) => {
                const _contract = Object.assign({}, contract, { benchmarkIndicator: v } as KfParseJsonDataContract);
                expect(_contract.benchmarkIndicator).toBeTruthy();
                const _result = repository.createDataEntity(_contract, userId, id, offset);
                expect(_result.BenchmarkIndicator).toEqual(true);
            });
        });

        test('entity.BenchmarkIndicator as Empty', () => {
            [false, undefined, null, '', 0].forEach((v) => {
                const _contract = Object.assign({}, contract, { benchmarkIndicator: v } as KfParseJsonDataContract);
                expect(_contract.benchmarkIndicator).toBeFalsy();
                const _result = repository.createDataEntity(_contract, userId, id, offset);
                expect(_result.BenchmarkIndicator).toEqual(false);
            });
        });

        test('entity.CreatedBy', () => {
            expect(result.CreatedBy).toEqual(userId);
        });

        test('entity.CreatedOn', () => {
            expect(result.CreatedOn).toBeInstanceOf(Date);
        });

        test('entity.CalcKnowHowPoints', () => {
            expect(result.CalcKnowHowPoints).toEqual(contract.CalcKnowHowPoints);
        });

        test('entity.CalcProblemSolvingPoints', () => {
            expect(result.CalcProblemSolvingPoints).toEqual(contract.CalcProblemSolvingPoints);
        });

        test('entity.CalcAccountabilityPoints', () => {
            expect(result.CalcAccountabilityPoints).toEqual(contract.CalcAccountabilityPoints);
        });

        test('entity.CalcKFHayPoints', () => {
            expect(contract.CalcWorkingConditionsPoints).toBeTruthy();
            expect(result.CalcWorkingConditionsPoints).toEqual(contract.CalcWorkingConditionsPoints);
        });

        test('entity.CalcKFHayPoints as Empty', () => {
            [0, false, undefined, null, ''].forEach((v) => {
                const _contract = Object.assign({}, contract, { CalcWorkingConditionsPoints: v } as KfParseJsonDataContract);
                expect(_contract.CalcWorkingConditionsPoints).toBeFalsy();
                const _result = repository.createDataEntity(_contract, userId, id, offset);
                expect(_result.CalcWorkingConditionsPoints).toBeNull();
            });
        });

        test('entity.CalcKFHayPoints', () => {
            expect(contract.CalcKFHayPoints).toBeTruthy();
            expect(result.CalcKFHayPoints).toEqual(contract.CalcKFHayPoints);
        });

        test('entity.CalcKFHayPoints as Empty', () => {
            [0, false, undefined, null, ''].forEach((v) => {
                const _contract = Object.assign({}, contract, { CalcKFHayPoints: v } as KfParseJsonDataContract);
                expect(_contract.CalcKFHayPoints).toBeFalsy();
                const _result = repository.createDataEntity(_contract, userId, id, offset);
                expect(_result.CalcKFHayPoints).toBeNull();
            });
        });

        test('entity.CalcGrade', () => {
            expect(result.CalcGrade).toEqual(contract.CalcGrade);
        });

        test('entity.CalcShortProfile', () => {
            expect(result.CalcShortProfile).toEqual(contract.CalcShortProfile);
        });

        test('entity.JP1_ID', () => {
            expect(result.JP1_ID).toEqual(contract.dynPropId0);
        });

        test('entity.JP1_Value', () => {
            expect(result.JP1_Value).toEqual(contract.dynProp0);
        });

        test('entity.JP2_ID', () => {
            expect(result.JP2_ID).toEqual(contract.dynPropId1);
        });

        test('entity.JP2_Value', () => {
            expect(result.JP2_Value).toEqual(contract.dynProp1);
        });

        test('entity.JP3_ID', () => {
            expect(result.JP3_ID).toEqual(contract.dynPropId2);
        });

        test('entity.JP3_Value', () => {
            expect(result.JP3_Value).toEqual(contract.dynProp2);
        });

        test('entity.JP4_ID', () => {
            expect(result.JP4_ID).toEqual(contract.dynPropId3);
        });

        test('entity.JP4_Value', () => {
            expect(result.JP4_Value).toEqual(contract.dynProp3);
        });

        test('entity.JP5_ID', () => {
            expect(result.JP5_ID).toEqual(contract.dynPropId4);
        });

        test('entity.JP5_Value', () => {
            expect(result.JP5_Value).toEqual(contract.dynProp4);
        });

        test('entity.JP6_ID', () => {
            expect(result.JP6_ID).toEqual(contract.dynPropId5);
        });

        test('entity.JP6_Value', () => {
            expect(result.JP6_Value).toEqual(contract.dynProp5);
        });

        test('entity.JP7_ID', () => {
            expect(result.JP7_ID).toEqual(contract.dynPropId6);
        });

        test('entity.JP7_Value', () => {
            expect(result.JP7_Value).toEqual(contract.dynProp6);
        });

        test('entity.JP8_ID', () => {
            expect(result.JP8_ID).toEqual(contract.dynPropId7);
        });

        test('entity.JP8_Value', () => {
            expect(result.JP8_Value).toEqual(contract.dynProp7);
        });
    });

    describe('.createDataEntities method', () => {
        test('Normal State', () => {
            const repository = new KfArchInsertDataRepository();
            const createDataEntityMock = jest.fn();
            repository.createDataEntity = createDataEntityMock;

            const ret = repository.createDataEntities(contracts, userId, id, offset);

            expect(ret.length).toEqual(contracts.length);
            expect(createDataEntityMock).toHaveBeenCalledTimes(contracts.length);
            contracts.forEach((contract, i) => {
                expect(createDataEntityMock).toHaveBeenCalledWith(contract, userId, id, offset + i + 1);
            });
        });
    });

    describe('.insertBulkData method', () => {
        const insertDataPost = getInsertDataPost();

        const typeormGetConnectionMock = jest.fn();
        const typeormCreateQueryBuilderMock = jest.fn();
        const typeormInsertMock = jest.fn();
        const typeormIntoMock = jest.fn();
        const typeormValuesMock = jest.fn();
        const typeormExecuteMock = jest.fn();

        (typeorm as any).getConnection = typeormGetConnectionMock;

        typeormGetConnectionMock.mockReturnValue({ createQueryBuilder: typeormCreateQueryBuilderMock });
        typeormCreateQueryBuilderMock.mockReturnValue({ insert: typeormInsertMock });
        typeormInsertMock.mockReturnValue({ into: typeormIntoMock });
        typeormIntoMock.mockReturnValue({ values: typeormValuesMock });
        typeormValuesMock.mockReturnValue({ execute: typeormExecuteMock });

        test('Normal State', async () => {
            const repository = new KfArchInsertDataRepository();
            const createDataEntitiesMock = jest.fn();
            const dataEntities = createN(getKfArchInsertDataEntity);

            createDataEntitiesMock.mockReturnValue(dataEntities);
            repository.createDataEntities = createDataEntitiesMock;

            const ret = await repository.insertBulkData(contracts, insertDataPost, userId, id, offset);

            expect(createDataEntitiesMock).toHaveBeenCalledWith(contracts, userId, id, offset);

            expect(typeormValuesMock).toHaveBeenCalledWith(dataEntities);
            expect(typeormExecuteMock).toHaveBeenCalledTimes(1);

            expect(ret).toEqual(insertDataPost);
        });

        test('Entity Creation Error, no TypeORM calls allowed', async () => {
            typeormGetConnectionMock.mockReset();

            const repository = new KfArchInsertDataRepository();
            const createDataEntitiesMock = jest.fn().mockImplementation(() => {
                throw new Error(getString());
            });
            repository.createDataEntities = createDataEntitiesMock;

            let ret: InsertDataPost;
            let err: Error;

            try {
                ret = await repository.insertBulkData(contracts, insertDataPost, userId, id, offset);
            } catch (e) {
                err = e;
            }

            expect(ret).toBeUndefined();
            expect(err).toBeInstanceOf(KfException);
            expect(typeormGetConnectionMock).toHaveBeenCalledTimes(0);
        });

        test('TypeORM Error', async () => {
            const repository = new KfArchInsertDataRepository();
            typeormExecuteMock.mockImplementation(() => {
                throw new Error(getString());
            });

            let ret: InsertDataPost;
            let err: Error;

            try {
                ret = await repository.insertBulkData(contracts, insertDataPost, userId, id, offset);
            } catch (e) {
                err = e;
            }

            expect(ret).toBeUndefined();
            expect(err).toBeInstanceOf(KfException);
        });
    });
});
