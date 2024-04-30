import { KfConfigService } from '@kf-products-core/kfhub_svc_lib';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { CronJob } from 'cron';
import { KfHubSchedulerService, SupportedTasks } from './kfhub-scheduler.service';

jest.mock('cron');
(CronJob as any).start = jest.fn();

describe('KfHubSchedulerService', () => {
    const getSpy = jest.fn();
    const addCronJobSpy = jest.fn();

    let module: TestingModule;
    let service: KfHubSchedulerService;
    let loggerLog: jest.SpyInstance;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                {
                    provide: KfConfigService,
                    useValue: {
                        get: getSpy,
                    },
                },
                {
                    provide: SchedulerRegistry,
                    useValue: {
                        addCronJob: addCronJobSpy,
                    },
                },

                KfHubSchedulerService,
            ],
        }).compile();
    });

    beforeEach(() => {
        service = module.get(KfHubSchedulerService);
        loggerLog = jest.spyOn((service as any).logger, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('runCrones', () => {
        test('Should log "Scheduler tasks not found" if scheduler tasks not found', () => {
            // Arrange
            getSpy.mockReturnValueOnce('[]');

            // Act
            service.runCrones();

            // Assert
            expect(loggerLog).toHaveBeenCalledWith('Scheduler tasks not found');
        });

        test('should throw error if Task parsing failed', () => {
            // Arrange
            let err;
            getSpy.mockReturnValueOnce('[!}');

            // Act
            try {
                service.runCrones();
            } catch (e) {
                err = e;
            }

            // Assert
            expect(err).toBeDefined();
        });

        test('should log "Scheduler task TestTask cron */x * * * * has wrong format" if task TestTask has wrong corn format', () => {
            // Arrange
            getSpy.mockReturnValueOnce(
                '[{"name":"TestTask","cron":"*/x * * * *","clientId":"11111","host":"0.0.0.0","port":22,"path":"/tmp/{clientId}/{date}/test.txt","credentials":{"username":"admUser","password":"pwd"}}]',
            );

            // Act
            service.runCrones();

            // Assert
            expect(loggerLog).toHaveBeenCalledWith('Scheduler task TestTask cron */x * * * * has wrong format');
        });

        test('should start crons for each task', () => {
            // Arrange
            getSpy.mockReturnValueOnce(
                '[{"name":"TestTask1","cron":"*/2 * * * *","clientId":"11111","host":"0.0.0.0","port":22,"path":"/tmp/{clientId}/{date}/test.txt","credentials":{"username":"admUser","password":"pwd"}},{"name":"TestTask2","cron":"*/3 * * * *","clientId":"11111","host":"0.0.0.0","port":22,"path":"/tmp/{clientId}/{date}/test.txt","credentials":{"username":"admUser","password":"pwd"}}]',
            );

            // Act
            service.runCrones();

            // Assert
            expect(addCronJobSpy).toHaveBeenCalledTimes(2);
            expect(loggerLog).toHaveBeenCalledWith('Schedule task TestTask1 successfully started');
            expect(loggerLog).toHaveBeenCalledWith('Schedule task TestTask2 successfully started');
        });
    });

    describe('executeCron', () => {
        test('should log "Scheduler task TestTask not supported" if task name is not from SupportedTasks', () => {
            // Act
            (service as any).executeCron({ name: 'TestTask' });

            // Assert
            expect(loggerLog).toHaveBeenCalledWith('Scheduler task TestTask not supported');
        });
    });
});
