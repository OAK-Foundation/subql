// Copyright 2020-2022 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PoiService,
  MmrService,
  BaseProjectService,
  StoreService,
  NodeConfig,
} from '@subql/node-core';
import { SubstrateDatasource } from '@subql/types';
import { Sequelize } from 'sequelize';
import {
  generateTimestampReferenceForBlockFilters,
  SubqlProjectDs,
  SubqueryProject,
} from '../configure/SubqueryProject';
import { ApiService } from './api.service';
import { DsProcessorService } from './ds-processor.service';
import { DynamicDsService } from './dynamic-ds.service';
import { UnfinalizedBlocksService } from './unfinalizedBlocks.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: packageVersion } = require('../../package.json');

@Injectable()
export class ProjectService extends BaseProjectService<SubstrateDatasource> {
  protected packageVersion = packageVersion;

  constructor(
    dsProcessorService: DsProcessorService,
    apiService: ApiService,
    poiService: PoiService,
    mmrService: MmrService,
    sequelize: Sequelize,
    @Inject('ISubqueryProject') project: SubqueryProject,
    storeService: StoreService,
    nodeConfig: NodeConfig,
    dynamicDsService: DynamicDsService,
    eventEmitter: EventEmitter2,
    unfinalizedBlockService: UnfinalizedBlocksService,
  ) {
    super(
      dsProcessorService,
      apiService,
      poiService,
      mmrService,
      sequelize,
      project,
      storeService,
      nodeConfig,
      dynamicDsService,
      eventEmitter,
      unfinalizedBlockService,
    );
  }

  protected async generateTimestampReferenceForBlockFilters(
    ds: SubqlProjectDs[],
  ): Promise<SubqlProjectDs[]> {
    return generateTimestampReferenceForBlockFilters(ds, this.apiService.api);
  }

  protected getStartBlockDatasources(): SubstrateDatasource[] {
    return this.project.dataSources.filter(
      (ds) =>
        !ds.filter?.specName ||
        ds.filter.specName ===
          this.apiService.api.runtimeVersion.specName.toString(),
    );
  }
}
