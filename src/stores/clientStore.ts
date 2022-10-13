import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import userService from '../services/user/userService';
import {
  AnswerOutPutDto,
  AppointmentDto,
  ClientDto,
  ClientPagedFilterRequest,
  DailySessionDto,
  HealthProfileAnswerDto,
  LifeDreamDto,
  MomentDto,
  PositiveHabitDto,
  ToDoTaskDto,
} from '../services/clients/dto/clientDto';
import clientsService from '../services/clients/clientsService';
import { CreateClientDto } from '../services/clients/dto/createClientDto';
import { UpdateClientDto } from '../services/clients/dto/updateClientDto';
import { ChallengeDto } from '../services/challenges/dto';
import { EventDto } from '../services/events/dto/eventDto';
import eventsService from '../services/events/eventsService';

class ClientStore extends StoreBase {
  @observable clients: Array<ClientDto> = [];
  @observable loadingClients = true;

  @observable moments: Array<MomentDto> = [];
  @observable loadingMoments = true;
  @observable momentsTotalCount: number = 0;
  @observable isGettingMomentData = false;
  @observable momentModel?: MomentDto = undefined;

  @observable dishes: Array<any> = [];
  @observable loadingDishes = true;
  @observable dishesTotalCount: number = 0;

  @observable toDoList: Array<ToDoTaskDto> = [];
  @observable loadingToDoList = true;
  @observable toDoListTotalCount: number = 0;

  @observable dreams: Array<LifeDreamDto> = [];
  @observable loadingDreams = true;
  @observable dreamsTotalCount: number = 0;

  @observable habits: Array<PositiveHabitDto> = [];
  @observable loadingHabits = true;
  @observable habitsTotalCount: number = 0;

  @observable appointments: Array<AppointmentDto> = [];
  @observable loadingAppointments = true;
  @observable appointmentTotalCount: number = 0;
  @observable isGettingAppointmentData = false;
  @observable appointmentModel?: AppointmentDto = undefined;

  @observable challenges: Array<ChallengeDto> = [];
  @observable loadingChallenges = true;
  @observable challengesTotalCount: number = 0;

  @observable events: Array<EventDto> = [];
  @observable loadingEvents = true;
  @observable eventsTotalCount: number = 0;
  @observable isGettingEventData = false;
  @observable eventModel?: EventDto = undefined;

  @observable sessions: Array<DailySessionDto> = [];
  @observable loadingSessions = true;
  @observable sessionsTotalCount: number = 0;
  @observable isGettingSessionData = false;
  @observable sessionModel?: DailySessionDto = undefined;

  @observable clientsForExport: Array<ClientDto> = [];
  @observable loadingClientsForExport = true;
  @observable isSubmittingClient = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;

  @observable clientModel?: ClientDto = undefined;

  @observable healthQuestions: Array<HealthProfileAnswerDto> = [];
  @observable personalityQuestions: Array<AnswerOutPutDto> = [];

  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;

  @action
  async getClients() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
        });
        this.clients = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingClients = true;
      },
      () => {
        this.loadingClients = false;
      }
    );
  }

  @action
  async getClientsForExport() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getAll({
          skipCount: 0,
          maxResultCount: 100000000,
          keyword: this.keyword,
          isActive: this.isActiveFilter,
        });
        this.clientsForExport = result.items;
      },
      () => {
        this.loadingClientsForExport = true;
      },
      () => {
        this.loadingClientsForExport = false;
      }
    );
  }

  @action
  async getHealthProfileAnswers(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getHealthProfileAnswers(input);
        this.healthQuestions = result;
      },
      () => {
        this.loadingClients = true;
      },
      () => {
        this.loadingClients = false;
      }
    );
  }

  @action
  async getChallenges(input: ClientPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getChallenges({
          clientId: input.clientId,
          maxResultCount: input.maxResultCount,
          skipCount: input.skipCount,
        });
        this.challenges = result.items;
        this.challengesTotalCount = result.totalCount;
      },
      () => {
        this.loadingChallenges = true;
      },
      () => {
        this.loadingChallenges = false;
      }
    );
  }
  @action
  async getEvents(input: ClientPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getEvents({
          clientId: input.clientId,
          maxResultCount: input.maxResultCount,
          skipCount: input.skipCount,
        });
        this.events = result.items;
        this.eventsTotalCount = result.totalCount;
      },
      () => {
        this.loadingEvents = true;
      },
      () => {
        this.loadingEvents = false;
      }
    );
  }

  @action
  async getEvent(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        const event = await eventsService.getEvent(input);
        if (event !== undefined) {
          this.eventModel = {
            id: event.id,
            title: event.title,
            status: event.status,
            arTitle: event.arTitle,
            enTitle: event.enTitle,
            createdBy: event.createdBy,
            parentId: event.parentId,
            creationTime: event.creationTime,
            buyingMethod: event.buyingMethod,
            categoryId: event.categoryId,
            cityId: event.cityId,
            repeat: event.repeat,
            mainPicture: event.mainPicture,
            gallery: event.gallery,
            arAbout: event.arAbout,
            enAbout: event.enAbout,
            tags: event.tags,
            hideComments: event.hideComments,
            arDescription: event.arDescription,
            enDescription: event.enDescription,
            isRefundable: event.isRefundable,
            startDate: event.startDate,
            endDate: event.endDate,
            fromHour: event.fromHour,
            toHour: event.toHour,
            feesType: event.feesType,
            schedules: event.schedules,
            placeName: event.placeName,
            totalSeats: event.totalSeats,
            silverTicketPrice: event.silverTicketPrice,
            goldenTicketPrice: event.goldenTicketPrice,
            platinumTicketPrice: event.platinumTicketPrice,
            vipTicketPrice: event.vipTicketPrice,
            latitude: event.latitude,
            longitude: event.longitude,
            categoryName: event.categoryName,
            commentsCount: event.commentsCount,
            likesCount: event.likesCount,
            description: event.description,
            cityName: event.cityName,
            about: event.about,
            bookedSeats: event.bookedSeats,
            price: event.price,
            tickets: event.tickets,
            organizerId: event.organizerId,
            organizer: event.organizer,
            availableSeats: event.availableSeats,
            clients: event.clients,
            creatorUserId: event.creatorUserId,
            eventType: event.eventType,
            invitationCode: event.invitationCode,
            isFeatured: event.isFeatured,
            isLiked: event.isLiked,
            link: event.link,
            scannedTicketsNum: event.scannedTicketsNum,
            ticketsCount: event.ticketsCount,
            arGoldenTicketDescription: event.arGoldenTicketDescription,
            arPlatinumTicketDescription: event.arPlatinumTicketDescription,
            arSilverTicketDescription: event.arSilverTicketDescription,
            arVIPTicketDescription: event.arVIPTicketDescription,
            enGoldenTicketDescription: event.enGoldenTicketDescription,
            enPlatinumTicketDescription: event.enPlatinumTicketDescription,
            enSilverTicketDescription: event.enSilverTicketDescription,
            enVIPTicketDescription: event.enVIPTicketDescription,
          };
        }
      },
      () => {
        this.isGettingEventData = true;
      },
      () => {
        this.isGettingEventData = false;
      }
    );
  }

  @action
  async getPersonalityAnswers(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getPersonalityAnswers(input);
        this.personalityQuestions = result;
      },
      () => {
        this.loadingClients = true;
      },
      () => {
        this.loadingClients = false;
      }
    );
  }

  @action
  async getDishes(input: ClientPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getDishes(input);
        this.dishes = result.items;
        this.dishesTotalCount = result.totalCount;
      },
      () => {
        this.loadingDishes = true;
      },
      () => {
        this.loadingDishes = false;
      }
    );
  }

  @action
  async getSessions(input: ClientPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getSessions(input);
        this.sessions = result.items;
        this.sessionsTotalCount = result.totalCount;
      },
      () => {
        this.loadingSessions = true;
      },
      () => {
        this.loadingSessions = false;
      }
    );
  }

  @action
  async getSession(input: EntityDto) {
    let session1 = this.sessions.find((c) => c.id === input.id);
    if (session1 !== undefined) {
      this.sessionModel = {
        id: session1.id,
        creationTime: session1.creationTime,
        clientId: session1.clientId,
        exerciseSessionId: session1.exerciseSessionId,
        trainingKcal: session1.trainingKcal,
        creatorUserId: session1.creatorUserId,
        session: session1.session,
        walkingKcal: session1.walkingKcal,
      };
    }
  }

  @action
  async getToDoList(input: ClientPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getToDoList({
          clientId: input.clientId,
          maxResultCount: input.maxResultCount,
          skipCount: input.skipCount,
        });
        this.toDoList = result.items;
        this.toDoListTotalCount = result.totalCount;
      },
      () => {
        this.loadingToDoList = true;
      },
      () => {
        this.loadingToDoList = false;
      }
    );
  }

  @action
  async getAppointments(input: ClientPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getAppointments({
          clientId: input.clientId,
          maxResultCount: input.maxResultCount,
          skipCount: input.skipCount,
        });
        this.appointments = result.items;
        this.appointmentTotalCount = result.totalCount;
      },
      () => {
        this.loadingAppointments = true;
      },
      () => {
        this.loadingAppointments = false;
      }
    );
  }

  @action
  async getPositiveHabit(input: ClientPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getPositiveHabit({
          clientId: input.clientId,
          maxResultCount: input.maxResultCount,
          skipCount: input.skipCount,
        });
        this.habits = result.items;
        this.habitsTotalCount = result.totalCount;
      },
      () => {
        this.loadingHabits = true;
      },
      () => {
        this.loadingHabits = false;
      }
    );
  }

  @action
  async getAppointment(input: EntityDto) {
    let appointment = this.appointments.find((c) => c.id === input.id);
    if (appointment !== undefined) {
      this.appointmentModel = {
        id: appointment.id,
        allDays: appointment.allDays,
        clientId: appointment.clientId,
        clients: appointment.clients,
        createdBy: appointment.createdBy,
        creatorUserId: appointment.creatorUserId,
        creationTime: appointment.creationTime,
        endDate: appointment.endDate,
        fromHour: appointment.fromHour,
        isDone: appointment.isDone,
        note: appointment.note,
        priority: appointment.priority,
        reminder: appointment.reminder,
        repeat: appointment.repeat,
        startDate: appointment.startDate,
        title: appointment.title,
        toHour: appointment.toHour,
      };
    }
  }

  @action
  async getDreams(input: ClientPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getLifeDreams({
          clientId: input.clientId,
          maxResultCount: input.maxResultCount,
          skipCount: input.skipCount,
        });
        this.dreams = result.items;
        this.dreamsTotalCount = result.totalCount;
      },
      () => {
        this.loadingDreams = true;
      },
      () => {
        this.loadingDreams = false;
      }
    );
  }

  @action
  async createClient(input: CreateClientDto) {
    await this.wrapExecutionAsync(
      async () => {
        await clientsService.createClient(input);
        await this.getClients();
        notifySuccess();
      },
      () => {
        this.isSubmittingClient = true;
      },
      () => {
        this.isSubmittingClient = false;
      }
    );
  }

  @action
  async updateClient(input: UpdateClientDto) {
    await this.wrapExecutionAsync(
      async () => {
        await clientsService.updateClient(input);
        await this.getClients();
        notifySuccess();
      },
      () => {
        this.isSubmittingClient = true;
      },
      () => {
        this.isSubmittingClient = false;
      }
    );
  }

  @action
  async getClient(input: EntityDto) {
    let admin = this.clients.find((c) => c.id === input.id);
    if (admin !== undefined) {
      this.clientModel = {
        id: admin.id,
        name: admin.name,
        status: admin.status,
        emailAddress: admin.emailAddress,
        surname: admin.surname,
        countryCode: admin.countryCode,
        phoneNumber: admin.phoneNumber,
        fullName: admin.fullName,
        creationTime: admin.creationTime,
        code: admin.code,
        city: admin.city,
        addresses: admin.addresses,
        lastLoginTime: admin.lastLoginTime,
        gender: admin.gender,
        hasAvatar: admin.hasAvatar,
        imageUrl: admin.imageUrl,
        paymentsCount: admin.paymentsCount,
        birthDate: admin.birthDate,
        userName: admin.userName,
      };
    }
  }

  @action
  async clientActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await userService.userActivation(input);
        await this.getClients();
        notifySuccess();
      },
      () => {
        this.loadingClients = true;
      },
      () => {
        this.loadingClients = false;
      }
    );
  }
  @action
  async clientDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await userService.userDeactivation(input);
        await this.getClients();
        notifySuccess();
      },
      () => {
        this.loadingClients = true;
      },
      () => {
        this.loadingClients = false;
      }
    );
  }

  @action
  async getMoments(input: ClientPagedFilterRequest) {
    await this.wrapExecutionAsync(
      async () => {
        let result = await clientsService.getMoments(input);
        this.moments = result.items;
        this.momentsTotalCount = result.totalCount;
      },
      () => {
        this.loadingMoments = true;
      },
      () => {
        this.loadingMoments = false;
      }
    );
  }

  @action
  async getMoment(input: EntityDto) {
    let moment = this.moments.find((c) => c.id === input.id);
    if (moment !== undefined) {
      this.momentModel = {
        id: moment.id,
        creationTime: moment.creationTime,
        clientId: moment.clientId,
        caption: moment.caption,
        challenge: moment.challenge,
        creatorUserId: moment.creatorUserId,
        challengeId: moment.challengeId,
        client: moment.client,
        comments: moment.comments,
        commentsCount: moment.commentsCount,
        createdBy: moment.createdBy,
        feelingIconUrl: moment.feelingIconUrl,
        imageUrl: moment.imageUrl,
        interactions: moment.interactions,
        interactionsCount: moment.interactionsCount,
        lat: moment.lat,
        long: moment.long,
        placeName: moment.placeName,
        songId: moment.songId,
        songName: moment.songName,
        tags: moment.tags,
        videos: moment.videos,
      };
    }
  }
}

export default ClientStore;
